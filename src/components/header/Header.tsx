import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowPointer} from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  return (
      <header className="p-3 bg-white shadow-custom-bottom">
        <div className="justify-center flex">
          <a className="text-3xl z-10" href="/">
          <FontAwesomeIcon className="z-0 mb-1" icon={faArrowPointer} bounce size="lg" style={{color: "#ff9500",}} />
            Click Meee</a>
        </div>
      </header>
  );
}
