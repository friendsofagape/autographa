import Link from 'next/link';

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
      <ul>
        <li className="text-gray-900 font-medium hover:text-white hover:bg-primary cursor-pointer py-5">
          <Link href="/projects">
            <a className="flex flex-col items-center" href="#projects">
              <img
                className="h-7 w-7"
                src="/icons/projects.svg"
                alt="projects"
              />
              <div className="text-xs mt-3 uppercase">projects</div>
            </a>
          </Link>
        </li>
        <li className="text-gray-900 font-medium hover:text-white hover:bg-primary cursor-pointer py-5">
          <Link href="/newproject">
            <a className="flex flex-col items-center" href="#new">
              <img
                className="h-7 w-7"
                src="/icons/new.svg"
                alt="newproject"
              />
              <div className="text-xs mt-3 uppercase">new</div>
            </a>
          </Link>
        </li>
        <li className="text-gray-900 font-medium hover:text-white hover:bg-primary cursor-pointer py-5">
          <Link href="/sync">
            <a className="flex flex-col items-center" href="#sync">
              <img
                className="h-7 w-7"
                src="/icons/sync.svg"
                alt="sync"
              />
              <div className="text-xs mt-3 uppercase">sync</div>
            </a>
          </Link>
        </li>
      </ul>
    </div>

  );
}
