import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: '計算式', path: '/vdot-formula' },
  { label: 'トレーニング', path: '/vdot-training' },
  { label: '同等', path: '/vdot-equivalent' },
];

const VdotTabs = () => {
  const location = useLocation();
  return (
    <ul className="flex border-b">
      {tabs.map((tab, index) => (
        <li key={index} className="-mb-px mr-2 last:mr-0">
          <Link
            to={tab.path}
            className={`text-xs font-semibold py-2 px-4 ${
              location.pathname === tab.path ? 'border border-t-0 border-r-0 border-l-0 border-blue-500 text-blue-600' : 'text-gray-800'
            }`}
          >
            {tab.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default VdotTabs