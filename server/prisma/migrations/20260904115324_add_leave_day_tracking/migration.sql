-- CreateTable
CREATE TABLE "leave_days" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leave_request_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "consumed" BOOLEAN NOT NULL DEFAULT false,
    "consumed_at" TIMESTAMP(3),

    CONSTRAINT "leave_days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leave_days_leave_request_id_date_key" ON "leave_days"("leave_request_id", "date");

-- AddForeignKey
ALTER TABLE "leave_days" ADD CONSTRAINT "leave_days_leave_request_id_fkey" FOREIGN KEY ("leave_request_id") REFERENCES "leave_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
