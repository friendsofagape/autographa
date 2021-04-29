export default function SideBar() {
  return (

    <div className="w-28 bg-white shadow min-h-screen">
      <div className="grid justify-items-center items-center h-16 border border-b-1">
        <img
          className="h-8 w-8"
          src="/logo.svg"
          alt="Workflow"
        />
      </div>
      <ul className="mt-8">
        <li className="text-gray-900 font-medium hover:text-gray-600 cursor-pointer mb-12">
          <div className="flex flex-col items-center">
            <img
              className="h-7 w-7"
              src="/icons/projects.svg"
              alt="Workflow"
            />
            <div className="text-xs mt-3 uppercase">projects</div>
          </div>
        </li>
        <li className="text-gray-900 font-medium hover:text-gray-600 cursor-pointer mb-12">
          <div className="flex flex-col items-center">
            <img
              className="h-7 w-7"
              src="/icons/new.svg"
              alt="Workflow"
            />
            <div className="text-xs mt-3 uppercase">new</div>
          </div>
        </li>
        <li className="text-gray-900 font-medium hover:text-gray-600 cursor-pointer mb-12">
          <div className="flex flex-col items-center">
            <img
              className="h-7 w-7"
              src="/icons/sync.svg"
              alt="Workflow"
            />
            <div className="text-xs mt-3 uppercase">sync</div>
          </div>
        </li>
      </ul>
    </div>

  );
}
