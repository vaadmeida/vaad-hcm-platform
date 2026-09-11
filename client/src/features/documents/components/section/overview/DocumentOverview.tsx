
import DocumentActivity from "./DocumentActivity";
import DocumentsStats from "./DocumentsStats";

const DocumentOverview = () => {
    return (
        <div className="space-y-6">
            <DocumentsStats/>
             <DocumentActivity/>
        </div>
    );
};

export default DocumentOverview;