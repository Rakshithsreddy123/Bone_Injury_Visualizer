CREATE TABLE `diagnoses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reportText` text NOT NULL,
	`findings` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `diagnoses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `findings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`diagnosisId` int NOT NULL,
	`bodyPart` varchar(128) NOT NULL,
	`condition` varchar(256) NOT NULL,
	`severity` enum('severe','moderate','mild') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `findings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `diagnoses` ADD CONSTRAINT `diagnoses_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `findings` ADD CONSTRAINT `findings_diagnosisId_diagnoses_id_fk` FOREIGN KEY (`diagnosisId`) REFERENCES `diagnoses`(`id`) ON DELETE no action ON UPDATE no action;