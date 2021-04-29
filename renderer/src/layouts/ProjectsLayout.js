import SideBar from './SideBar';
import TopMenuBar from './TopMenuBar';

export default function ProjectsLayout(props) {
  const {
    children,
    title,
    header,
    isTwoCol,
    colOne,
    colTwo,
  } = props;

  return (
    <div className="flex">

      <SideBar />

      <div className="w-full">

        <TopMenuBar />

        <header className="bg-white shadow">
          {!isTwoCol
            ? (
              <div className="mx-auto py-4 px-4 sm:px-4 lg:px-6 border-primary border-b-4 flex items-center">
                <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider">{title}</h1>
                {header}
              </div>
            )
            : (
              <div className="mx-auto px-4 sm:px-4 lg:px-6 border-primary border-b-4 grid grid-cols-2 gap-2">
                <div className="flex flex-row py-4 items-center">
                  <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider">{title}</h1>
                  {colOne}
                </div>
                <div className="flex items-end">
                  {colTwo}
                </div>
              </div>
            )}
        </header>

        <main>
          {children}
        </main>

      </div>

    </div>

  );
}
