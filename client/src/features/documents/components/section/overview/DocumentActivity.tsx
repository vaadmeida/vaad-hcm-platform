import ExpiringDocuments from "./ExpiringDocuments"
import RecentDocuments from "./RecentDocuments"


const DocumentActivity = () => {
    return (
        <div className="grid items-start gap-6 lg:grid-cols-2 mt-8">
            <RecentDocuments />
            <ExpiringDocuments/>
        </div>
    )
}

export default DocumentActivity
