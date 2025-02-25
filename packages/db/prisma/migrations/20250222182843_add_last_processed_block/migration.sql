-- CreateTable
CREATE TABLE "ProcessBlock" (
    "id" SERIAL NOT NULL,
    "lastBlock" TEXT NOT NULL,

    CONSTRAINT "ProcessBlock_pkey" PRIMARY KEY ("id")
);
