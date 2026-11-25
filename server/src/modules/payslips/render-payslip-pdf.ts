import PDFDocument from "pdfkit";
import { join } from "node:path";
import { PayslipPdfInput } from "./payslips.types.ts";


const money = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const periodFormat = new Intl.DateTimeFormat("en-NG", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
});

export async function renderPayslipPdf(
    input: PayslipPdfInput,
    assetsDir = join(process.cwd(), "assets")
): Promise<Buffer> {
    const period = periodFormat.format(
        new Date(Date.UTC(input.year, input.month - 1, 1))
    );

    const pdf = new PDFDocument({
        size: "A4",
        margin: 48,
        info: {
            Title: `VAAD Payslip - ${period}`,
            Author: "VAAD HR",
        },
    });

    const regular = "Poppins";
    const semibold = "Poppins-SemiBold";
    const ink = "#172033";
    const muted = "#526073";
    const divider = "#E5E7EB";
    const accent = "#214E45";

    const left = pdf.page.margins.left;
    const right = pdf.page.width - pdf.page.margins.right;
    const width = right - left;
    const amountWidth = 160;
    const labelWidth = width - amountWidth - 16;

    pdf.registerFont(regular, join(assetsDir, "fonts", "Poppins-Regular.ttf"));
    pdf.registerFont(semibold, join(assetsDir, "fonts", "Poppins-SemiBold.ttf"));

    let y = 48;

    function drawDivider(at: number) {
        pdf.save()
            .moveTo(left, at)
            .lineTo(right, at)
            .lineWidth(0.5)
            .stroke(divider)
            .restore();
    }

    function ensureSpace(height: number) {
        const bottom = pdf.page.height - pdf.page.margins.bottom;

        if (y + height > bottom) {
            pdf.addPage();
            y = pdf.page.margins.top;
        }
    }

    function drawHeading(label: string) {
        ensureSpace(44);
        pdf.font(semibold)
            .fontSize(8)
            .fillColor(muted)
            .text(label, left, y, { characterSpacing: 1 });

        y += 20;
    }

    function drawRow(label: string, amount: string, subtotal = false) {
        const formattedAmount = money.format(Number(amount));

        pdf.font(subtotal ? semibold : regular).fontSize(9.5);
        const height = Math.max(
            pdf.heightOfString(label, { width: labelWidth }),
            pdf.heightOfString(formattedAmount, { width: amountWidth })
        );

        ensureSpace(height + 14);

        if (subtotal) {
            drawDivider(y);
            y += 6;
        }

        pdf.fillColor(ink)
            .text(label, left, y, { width: labelWidth })
            .text(formattedAmount, right - amountWidth, y, {
                width: amountWidth,
                align: "right",
            });

        y += height + 7;
    }

    // VAAD header
    pdf.roundedRect(left, y, width, 76, 8).fill(ink);
    pdf.image(join(assetsDir, "vaad_logo.png"), left + 16, y + 15, {
        fit: [135, 46],
        valign: "center",
    });

    pdf.font(semibold)
        .fontSize(20)
        .fillColor("#FFFFFF")
        .text("Payslip", right - 196, y + 13, {
            width: 180,
            align: "right",
        });

    pdf.font(regular)
        .fontSize(9)
        .fillColor("#CBD5E1")
        .text(period, right - 196, y + 45, {
            width: 180,
            align: "right",
        });

    // Employee details
    y += 96;
    pdf.font(semibold)
        .fontSize(13)
        .fillColor(ink)
        .text(input.employeeName, left, y, { width });

    y = pdf.y + 3;

    const employeeDetails = [input.employeeNumber, ...input.departmentNames]
        .filter(Boolean)
        .join("  |  ");

    if (employeeDetails) {
        pdf.font(regular)
            .fontSize(9)
            .fillColor(muted)
            .text(employeeDetails, left, y, { width });

        y = pdf.y + 12;
    } else {
        y += 8;
    }

    drawDivider(y);
    y += 14;

    drawHeading("SALARY BREAKDOWN");
    for (const component of input.components) {
        drawRow(component.label, component.amount);
    }
    drawRow("Monthly Gross Salary", input.monthlyGross, true);

    if (input.earnings.length > 0) {
        y += 12;
        drawHeading("ADDITIONAL EARNINGS");

        for (const earning of input.earnings) {
            drawRow(earning.label, earning.amount);
        }
    }

    drawRow("Gross Pay", input.grossPay, true);

    y += 12;
    drawHeading("DEDUCTIONS");
    drawRow("PAYE", input.paye);
    drawRow("Other Deductions", input.otherDeductions);

    y += 12;
    ensureSpace(56);
    pdf.roundedRect(left, y, width, 56, 8)
        .fillAndStroke("#F2F7F5", "#DFE9E4");

    pdf.font(semibold)
        .fontSize(10)
        .fillColor(accent)
        .text("Net Pay", left + 16, y + 20);

    pdf.fontSize(18)
        .text(money.format(Number(input.netPay)), right - 236, y + 13, {
            width: 220,
            align: "right",
        });

    pdf.end();

    const chunks: Buffer[] = [];
    for await (const chunk of pdf) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
}