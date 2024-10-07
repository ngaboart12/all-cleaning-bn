-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CLIENT', 'PROVIDER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- CreateTable
CREATE TABLE "Otps" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "otp" INTEGER,
    "expireIn" TIMESTAMP(3),
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "isVerfied" BOOLEAN DEFAULT false,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyBio" TEXT NOT NULL,
    "companyLogo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "files" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderOnService" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "description" TEXT,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "estimatedPrice" DOUBLE PRECISION,
    "additionalInfo" TEXT,

    CONSTRAINT "ProviderOnService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalFees" (
    "id" TEXT NOT NULL,
    "providerOnServiceId" TEXT NOT NULL,
    "fees" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "AdditionalFees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "bookingId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookingToReview" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Otps_email_key" ON "Otps"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_companyName_key" ON "Provider"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_email_key" ON "Provider"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_userId_key" ON "Provider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderOnService_providerId_serviceId_key" ON "ProviderOnService"("providerId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "_BookingToReview_AB_unique" ON "_BookingToReview"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingToReview_B_index" ON "_BookingToReview"("B");

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderOnService" ADD CONSTRAINT "ProviderOnService_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderOnService" ADD CONSTRAINT "ProviderOnService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalFees" ADD CONSTRAINT "AdditionalFees_providerOnServiceId_fkey" FOREIGN KEY ("providerOnServiceId") REFERENCES "ProviderOnService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToReview" ADD CONSTRAINT "_BookingToReview_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToReview" ADD CONSTRAINT "_BookingToReview_B_fkey" FOREIGN KEY ("B") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
