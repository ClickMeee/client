import { faArrowPointer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Header() {
  return (
    <header className="p-3 bg-white shadow-custom-bottom relative">
      <div className="justify-center flex items-center gap-2 ">
        <FontAwesomeIcon
          className="relative z-0 mb-1"
          icon={faArrowPointer}
          bounce
          size="lg"
          style={{ color: '#ff9500' }}
        />
        <span className="relative z-10 text-black text-3xl">Click Meee</span>
      </div>
    </header>
  );
}
