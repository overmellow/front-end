-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "content" TEXT,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);
