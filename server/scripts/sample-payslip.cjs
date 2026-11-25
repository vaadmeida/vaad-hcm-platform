const PDFDocument = require("pdfkit");
const fs = require("node:fs");
const path = require("node:path");
const { pipeline } = require("node:stream/promises");

const serverDir = path.resolve(__dirname, "..");
const assetsDir = path.join(serverDir, "assets");
const logoPath = path.join(assetsDir, "vaad_logo.png");
const regularFontPath = path.join(assetsDir, "fonts", "Poppins-Regular.ttf");
const semiboldFontPath = path.join(assetsDir, "fonts", "Poppins-SemiBold.ttf");
const outputPath = path.join(serverDir, "sample-payslip-poppins.pdf");

const sample = {
    period: "December 2026",
    employeeName: "Sample Employee",
    employeeNumber: "VAAD-0005",
    department: "Software Engineering",
    components: [
        ["Basic Salary", "146,666.67"],
        ["Housing Allowance", "133,333.33"],
        ["Transport Allowance", "133,333.33"],
        ["Medical Allowance", "120,000.00"],
        ["Meal Allowance", "66,666.67"],
        ["Wardrobe Allowance", "66,666.67"],
    ],
    monthlyGross: "666,666.67",
    earnings: [
        ["Performance Bonus", "50,000.00"],
        ["13th-Month Pay", "264,000.00"],
    ],
    grossPay: "980,666.67",
    deductions: [
        ["PAYE", "6,000.00"],
        ["Other Deductions", "0.00"],
    ],
    netPay: "974,666.67",
};

async function createPayslip() {
    for (const assetPath of [logoPath, regularFontPath, semiboldFontPath]) {
        if (!fs.existsSync(assetPath)) {
            throw new Error(`Required asset missing: ${assetPath}`);
        }
    }

    const pdf = new PDFDocument({
        size: "A4",
        margin: 48,
        info: {
            Title: `VAAD Payslip - ${sample.period}`,
            Author: "VAAD HR",
        },
    });

    pdf.registerFont("Poppins", regularFontPath);
    pdf.registerFont("Poppins-SemiBold", semiboldFontPath);

    const left = 48;
    const right = pdf.page.width - 48;
    const width = right - left;
    const ink = "#172033";
    const muted = "#526073";
    const gray = "#E5E7EB";
    const accent = "#214E45";

    function drawLine(y) {
        pdf.save()
            .moveTo(left, y)
            .lineTo(right, y)
            .lineWidth(0.5)
            .stroke(gray)
            .restore();
    }

    function drawHeading(label, y) {
        pdf.font("Poppins-SemiBold")
            .fontSize(8)
            .fillColor(muted)
            .text(label, left, y, { characterSpacing: 1 });
    }

    function drawRow(label, amount, y, emphasized = false) {
        const amountWidth = 160;

        pdf.font(emphasized ? "Poppins-SemiBold" : "Poppins")
            .fontSize(9.5)
            .fillColor(ink)
            .text(label, left, y, { width: width - amountWidth - 16 })
            .text(`NGN ${amount}`, right - amountWidth, y, {
                width: amountWidth,
                align: "right",
            });

        return y + 21;
    }

    // Brand header
    pdf.roundedRect(left, 48, width, 76, 8).fill(ink);
    pdf.image(logoPath, left + 16, 63, {
        fit: [135, 46],
        valign: "center",
    });

    pdf.font("Poppins-SemiBold")
        .fontSize(20)
        .fillColor("#FFFFFF")
        .text("Payslip", right - 196, 63, { width: 180, align: "right" });

    pdf.font("Poppins")
        .fontSize(9)
        .fillColor("#CBD5E1")
        .text(sample.period, right - 196, 94, { width: 180, align: "right" });

    // Employee details
    pdf.font("Poppins-SemiBold")
        .fontSize(13)
        .fillColor(ink)
        .text(sample.employeeName, left, 145);

    pdf.font("Poppins")
        .fontSize(9)
        .fillColor(muted)
        .text(sample.department, left, 166, { width: width - 110 })
        .text(sample.employeeNumber, right - 100, 166, {
            width: 100,
            align: "right",
        });

    drawLine(189);

    // Monthly salary components
    drawHeading("SALARY BREAKDOWN", 204);
    let y = 224;

    for (const [label, amount] of sample.components) {
        y = drawRow(label, amount, y);
    }

    drawLine(y - 2);
    y = drawRow("Monthly Gross Salary", sample.monthlyGross, y + 6, true);

    // Additional earnings and gross pay
    drawHeading("ADDITIONAL EARNINGS", y + 13);
    y += 33;

    for (const [label, amount] of sample.earnings) {
        y = drawRow(label, amount, y);
    }

    drawLine(y - 2);
    y = drawRow("Gross Pay", sample.grossPay, y + 6, true);

    // Deductions
    drawHeading("DEDUCTIONS", y + 13);
    y += 33;

    for (const [label, amount] of sample.deductions) {
        y = drawRow(label, amount, y);
    }

    // Take-home pay
    const netTop = y + 12;
    pdf.roundedRect(left, netTop, width, 56, 8)
        .fillAndStroke("#F2F7F5", "#DFE9E4");

    pdf.font("Poppins-SemiBold")
        .fontSize(10)
        .fillColor(accent)
        .text("Net Pay", left + 16, netTop + 21, { width: 110 });

    pdf.fontSize(18)
        .text(`NGN ${sample.netPay}`, right - 236, netTop + 15, {
            width: 220,
            align: "right",
        });

    const finished = pipeline(pdf, fs.createWriteStream(outputPath));
    pdf.end();
    await finished;

    console.log(`Created: ${outputPath}`);
}

createPayslip().catch((error) => {
    console.error(`Could not create payslip: ${error.message}`);
    process.exitCode = 1;
});