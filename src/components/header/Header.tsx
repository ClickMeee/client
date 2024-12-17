import { faArrowPointer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

export default function Header() {

  const navigate = useNavigate();
  const handleNavigatePage = (path: string) => {
        navigate(path);
  }

  return (
    <header className="p-3 bg-white shadow-custom-bottom sticky">
      <div className="justify-center flex items-center gap-2 ">
        <FontAwesomeIcon
          className="relative z-0 mb-1"
          icon={faArrowPointer}
          bounce
          size="lg"
          style={{ color: '#ff9500' }}
        />
        <span onClick={() => handleNavigatePage('/')} className="relative z-10 text-black text-3xl cursor-pointer">Click Meee</span>
      </div>
    </header>
  );
}
