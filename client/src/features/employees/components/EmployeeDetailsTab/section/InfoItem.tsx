interface InfoItemProps {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}

const InfoItem = ( {label , value,  icon}: InfoItemProps ) => {
  return (
   <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>

      <p className="mt-1.5 wrap-break-word text-sm font-medium text-[#121417]">
        {value || "—"}
      </p>
    </div>
  )
}

export default InfoItem
