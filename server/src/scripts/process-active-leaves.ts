import { processActiveLeaves } from "../modules/leave/leave.service.ts";


const run = async () => {
    try {
        const result = await processActiveLeaves();

        console.log("Leave processing completed:", result);

        process.exit(0);
    } catch (error) {
        console.error("Leave processing failed:", error);

        process.exit(1);
    }
};

run();