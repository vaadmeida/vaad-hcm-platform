import type { DocumentTabsTypes } from "@/features/documents/components/DocumentTabs"
import DocumentTabs from "@/features/documents/components/DocumentTabs"
import DocumentToolBar from "@/features/documents/components/DocumentToolBar"
import Documents from "@/features/documents/components/section/documents/Documents"
import DocumentTypes from "@/features/documents/components/section/documentsTypes/DocumentTypes"
import DocumentOverview from "@/features/documents/components/section/overview/DocumentOverview"
import { useState } from "react"

const DocumentPage = () => {

    const [activeTab, setActiveTab] = useState<DocumentTabsTypes>('Overview')

  return (
    <div className="space-y-6">
      <DocumentToolBar />

      <DocumentTabs
       activeTab={activeTab}
       onTabChange={setActiveTab}
      />

       {activeTab === 'Overview' && <DocumentOverview />}

       {activeTab === 'Documents' && (<Documents />)}

       {activeTab === 'Document Types' && (
          <DocumentTypes />
       )} 
 

    </div>
  )
}

export default DocumentPage
