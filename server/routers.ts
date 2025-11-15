import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { generateImage } from "./_core/imageGeneration";
import crypto from "crypto";

/**
 * Hash password using SHA-256
 */
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Verify password against hash
 */
function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

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
    "fracture",
    "sprain",
    "strain",
    "inflammation",
    "swelling",
    "pain",
    "lesion",
    "tumor",
    "cyst",
    "stenosis",
    "herniation",
    "dislocation",
    "subluxation",
    "arthritis",
    "pneumonia",
    "infection",
    "edema",
    "fibrosis",
    "necrosis",
    "hemorrhage",
    "bleeding",
    "contusion",
    "laceration",
    "tear",
    "rupture",
  ];

  const severities = {
    severe: ["severe", "critical", "acute", "major", "significant"],
    moderate: ["moderate", "moderate", "notable", "substantial"],
    mild: ["mild", "minor", "slight", "minimal", "small"],
  };

  // Extract findings from text
  const lowerText = reportText.toLowerCase();

  for (const bodyPart of bodyParts) {
    const bodyPartRegex = new RegExp(`\\b${bodyPart}\\b`, "gi");
    const bodyPartMatches = reportText.match(bodyPartRegex);

    if (bodyPartMatches) {
      for (const condition of conditions) {
        const conditionRegex = new RegExp(
          `\\b${condition}\\b.*?${bodyPart}|${bodyPart}.*?\\b${condition}\\b`,
          "gi"
        );
        const matches = reportText.match(conditionRegex);

        if (matches) {
          let severity: "severe" | "moderate" | "mild" = "mild";

          // Determine severity
          for (const [sev, keywords] of Object.entries(severities)) {
            if (keywords.some((kw) => matches[0].toLowerCase().includes(kw))) {
              severity = sev as "severe" | "moderate" | "mild";
              break;
            }
          }

          findings.push({
            bodyPart: bodyPart.charAt(0).toUpperCase() + bodyPart.slice(1),
            condition:
              condition.charAt(0).toUpperCase() + condition.slice(1),
            severity,
            description: matches[0],
          });
        }
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
    
    // Simple login with username and password
    login: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null)
          throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.username !== "string")
          throw new Error("username must be a string");
        if (typeof obj.password !== "string")
          throw new Error("password must be a string");
        return { username: obj.username, password: obj.password };
      })
      .mutation(async ({ ctx, input }) => {
        try {
          const { getUserByUsername } = await import("./db");
          
          const user = await getUserByUsername(input.username);
          if (!user) {
            throw new Error("Invalid username or password");
          }

          if (!user.passwordHash || !verifyPassword(input.password, user.passwordHash)) {
            throw new Error("Invalid username or password");
          }

          // Set session cookie
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, JSON.stringify(user), cookieOptions);

          return {
            success: true,
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          };
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Login failed");
        }
      }),

    // Simple registration with username and password
    register: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null)
          throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.username !== "string")
          throw new Error("username must be a string");
        if (typeof obj.password !== "string")
          throw new Error("password must be a string");
        if (typeof obj.name !== "string")
          throw new Error("name must be a string");
        return {
          username: obj.username,
          password: obj.password,
          name: obj.name,
          email: obj.email as string | undefined,
        };
      })
      .mutation(async ({ ctx, input }) => {
        try {
          const { getUserByUsername, createUser } = await import("./db");
          
          // Check if user already exists
          const existingUser = await getUserByUsername(input.username);
          if (existingUser) {
            throw new Error("Username already exists");
          }

          // Create new user
          const passwordHash = hashPassword(input.password);
          const result = await createUser(
            input.username,
            passwordHash,
            input.name,
            input.email
          );

          const newUser = await import("./db").then((m) =>
            m.getUserById((result as any).insertId)
          );

          if (!newUser) {
            throw new Error("Failed to create user");
          }

          // Set session cookie
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, JSON.stringify(newUser), cookieOptions);

          return {
            success: true,
            user: {
              id: newUser.id,
              username: newUser.username,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
            },
          };
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : "Registration failed");
        }
      }),

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
          try {
            const prompt = generateImagePrompt(extractedFindings);
            const imageResult = await generateImage({ prompt });

            if (imageResult && imageResult.url) {
              await updateDiagnosisImage(diagnosisId, imageResult.url);
            }
          } catch (imageError) {
            console.warn("Failed to generate image:", imageError);
            // Continue without image if generation fails
          }

          return {
            success: true,
            diagnosisId,
            findings: extractedFindings,
          };
        } catch (error) {
          console.error("Diagnosis creation error:", error);
          throw new Error(
            error instanceof Error ? error.message : "Failed to analyze report"
          );
        }
      }),

    // Get all diagnoses for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        const { getDiagnosisByUserId } = await import("./db");
        return await getDiagnosisByUserId(ctx.user.id);
      } catch (error) {
        console.error("Failed to fetch diagnoses:", error);
        return [];
      }
    }),

    // Get a specific diagnosis by ID
    get: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null)
          throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        if (typeof obj.id !== "number") throw new Error("id must be a number");
        return { id: obj.id };
      })
      .query(async ({ ctx, input }) => {
        try {
          const { getDiagnosisById, getFindingsByDiagnosisId } = await import(
            "./db"
          );
          const diagnosis = await getDiagnosisById(input.id);

          if (!diagnosis || diagnosis.userId !== ctx.user.id) {
            throw new Error("Diagnosis not found or unauthorized");
          }

          const findings = await getFindingsByDiagnosisId(input.id);

          return {
            ...diagnosis,
            findings,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Failed to fetch diagnosis"
          );
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
