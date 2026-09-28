export const tabTriggerClass = `
  relative flex h-11 items-center justify-center gap-2
  rounded-none border-0 bg-transparent
  px-2 text-xs font-medium text-gray-500
  shadow-none
  hover:text-[#1078A9]
  data-[state=active]:bg-transparent
  data-[state=active]:text-[#1078A9]
  data-[state=active]:shadow-none
  after:absolute after:bottom-0 after:left-0 after:right-0
  after:h-0.5 after:bg-transparent
  data-[state=active]:after:bg-[#1078A9]
  sm:h-12 sm:w-auto sm:justify-start sm:px-0 sm:text-sm
`;