import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { generateImage } from "./_core/imageGeneration";

/**
 * Simulate NLP extraction from medical report text
 * This is a simple pattern-matching approach for demonstration
 */
function extractDiagnosisFromText(reportText: string) {
  const findings: Array<{
    bodyPart: string;
    condition: string;
    severity: "severe" | "moderate" | "mild";
    description: string;
  }> = [];

  // Simple pattern matching for common medical terms
  const bodyParts = [
    "head",
    "neck",
    "shoulder",
    "arm",
    "elbow",
    "wrist",
    "hand",
    "chest",
    "heart",
    "lung",
    "abdomen",
    "stomach",
    "liver",
    "kidney",
    "spine",
    "back",
    "hip",
    "leg",
    "knee",
    "ankle",
    "foot",
    "left",
    "right",
    "upper",
    "lower",
  ];

  const conditions = [
    "fracture",
    "break",
    "crack",
    "lesion",
    "tumor",
    "inflammation",
    "swelling",
    "pain",
    "strain",
    "sprain",
    "tear",
    "rupture",
    "dislocation",
    "disease",
    "abnormality",
    "damage",
  ];

  const severityKeywords = {
    severe: ["severe", "critical", "acute", "serious", "major"],
    moderate: ["moderate", "significant", "notable"],
    mild: ["mild", "minor", "slight", "small"],
  };

  const lowerText = reportText.toLowerCase();

  // Extract findings based on patterns
  for (const bodyPart of bodyParts) {
    for (const condition of conditions) {
      const pattern = new RegExp(
        `(\\b${bodyPart}\\b.*?${condition}|${condition}.*?\\b${bodyPart}\\b)`,
        "gi"
      );
      const matches = lowerText.match(pattern);

      if (matches) {
        // Determine severity
        let severity: "severe" | "moderate" | "mild" = "mild";
        const matchText = matches[0].toLowerCase();

        if (severityKeywords.severe.some((kw) => matchText.includes(kw))) {
          severity = "severe";
        } else if (
          severityKeywords.moderate.some((kw) => matchText.includes(kw))
        ) {
          severity = "moderate";
        }

        findings.push({
          bodyPart: bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1),
          condition: condition.charAt(0).toUpperCase() + condition.slice(1),
          severity,
          description: matches[0],
        });
      }
    }
  }

  // If no findings extracted, provide a default
  if (findings.length === 0) {
    findings.push({
      bodyPart: "General",
      condition: "Assessment",
      severity: "mild",
      description: "Report received for analysis",
    });
  }

  return findings;
}

/**
 * Generate a detailed prompt for AI image generation based on findings
 */
function generateImagePrompt(findings: any[]): string {
  if (!findings || findings.length === 0) {
    return "Medical X-ray visualization of human body, professional medical imaging style";
  }

  // Build a detailed prompt based on findings
  const bodyParts = findings.map((f) => f.bodyPart).join(", ");
  const conditions = findings
    .map((f) => `${f.condition} (${f.severity})`)
    .join(", ");

  return `Professional medical X-ray visualization showing ${bodyParts}. 
Conditions: ${conditions}. 
Style: Realistic medical imaging, X-ray or CT scan style, with color-coded severity indicators.
Severe areas highlighted in red, moderate in orange, mild in yellow.
High quality medical illustration, anatomically accurate, professional medical imaging style.
Black background, clear anatomical details, clinical appearance.`;
}

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  diagnosis: router({
    // Create a new diagnosis from medical report text
    create: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null)
          throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.reportText !== "string")
          throw new Error("reportText must be a string");
        return { reportText: obj.reportText };
      })
      .mutation(async ({ ctx, input }) => {
        try {
          const {
            createDiagnosis,
            createFinding,
            updateDiagnosisImage,
          } = await import("./db");

          // Simulate NLP extraction from the report text
          const extractedFindings = extractDiagnosisFromText(input.reportText);

          // Create diagnosis record
          const result = await createDiagnosis(
            ctx.user.id,
            input.reportText,
            extractedFindings
          );

          // Get the inserted diagnosis ID
          const diagnosisId = (result as any).insertId || 1;
          if (!diagnosisId) {
            throw new Error("Failed to get diagnosis ID from database response");
          }

          // Create individual finding records
          for (const finding of extractedFindings) {
            await createFinding(
              diagnosisId,
              finding.bodyPart,
              finding.condition,
              finding.severity,
              finding.description
            );
          }

          // Generate AI image based on findings
          let imageUrl: string | null = null;
          try {
            const prompt = generateImagePrompt(extractedFindings);
            console.log("Generating image with prompt:", prompt);

            const imageResult = await generateImage({
              prompt,
            });

            if (imageResult && imageResult.url) {
              imageUrl = imageResult.url;
              // Update diagnosis with the generated image URL
              await updateDiagnosisImage(diagnosisId, imageUrl);
              console.log("Image generated successfully:", imageUrl);
            }
          } catch (imageError) {
            console.warn("Failed to generate image:", imageError);
            // Continue without image - this is not a critical failure
          }

          return {
            diagnosisId,
            findings: extractedFindings,
            imageUrl: imageUrl || null,
          };
        } catch (error) {
          console.error("Error in diagnosis.create:", error);
          throw new Error(
            `Failed to analyze report: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }),

    // Get all diagnoses for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        const { getDiagnosisByUserId } = await import("./db");
        return getDiagnosisByUserId(ctx.user.id);
      } catch (error) {
        console.error("Error in diagnosis.list:", error);
        return [];
      }
    }),

    // Get a specific diagnosis by ID
    getById: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null)
          throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.diagnosisId !== "number")
          throw new Error("diagnosisId must be a number");
        return { diagnosisId: obj.diagnosisId };
      })
      .query(async ({ input }) => {
        try {
          const {
            getDiagnosisById,
            getFindingsByDiagnosisId,
          } = await import("./db");
          const diagnosis = await getDiagnosisById(input.diagnosisId);
          if (!diagnosis) return null;

          const findingsData = await getFindingsByDiagnosisId(
            input.diagnosisId
          );
          return { ...diagnosis, findings: findingsData };
        } catch (error) {
          console.error("Error in diagnosis.getById:", error);
          return null;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
