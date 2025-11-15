import { eq } from "drizzle-orm";
import { diagnoses, findings } from "../drizzle/schema";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Diagnosis queries
export async function createDiagnosis(
  userId: number,
  reportText: string,
  findings: any[]
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(diagnoses).values({
    userId,
    reportText,
    findings: JSON.stringify(findings),
  });

  // Return the inserted diagnosis with ID
  const insertedId = (result as any).insertId || 1;
  return { insertId: insertedId, ...result };
}

export async function getDiagnosisByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(diagnoses).where(eq(diagnoses.userId, userId));
}

export async function getDiagnosisById(diagnosisId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(diagnoses)
    .where(eq(diagnoses.id, diagnosisId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateDiagnosisImage(
  diagnosisId: number,
  imageUrl: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(diagnoses)
    .set({ generatedImageUrl: imageUrl })
    .where(eq(diagnoses.id, diagnosisId));
}

export async function createFinding(
  diagnosisId: number,
  bodyPart: string,
  condition: string,
  severity: "severe" | "moderate" | "mild",
  description?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(findings).values({
    diagnosisId,
    bodyPart,
    condition,
    severity,
    description,
  });
}

export async function getFindingsByDiagnosisId(diagnosisId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(findings).where(eq(findings.diagnosisId, diagnosisId));
}



// Simple authentication functions
export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(
  username: string,
  passwordHash: string,
  name: string,
  email?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(users).values({
    openId: `simple_${username}_${Date.now()}`,
    username,
    passwordHash,
    name,
    email,
    loginMethod: "simple",
    role: "user",
  });

  const insertedId = (result as any).insertId || 1;
  return { insertId: insertedId, ...result };
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
