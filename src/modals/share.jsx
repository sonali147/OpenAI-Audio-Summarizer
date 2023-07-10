import { useState } from "react";
import Modal from "react-modal";
import { WhatsappShareButton, EmailShareButton } from 'react-share';
import { WhatsappIcon, EmailIcon } from 'react-share';
import '../index.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// eslint-disable-next-line react/prop-types
const ShareModal = ({ content }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleShareClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button color="primary" onClick={handleShareClick}>
        Share
      </button>
      <Modal 
        isOpen={modalOpen}
        onRequestClose={handleCloseModal}
        style={customStyles}
        // className="share-modal"
        contentLabel="Example Modal"
      >
        <h2>Share</h2>
        <WhatsappShareButton title={content}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <EmailShareButton subject='Action Item' body={content}>
          <EmailIcon size={32} round />
        </EmailShareButton>
      </Modal>
    </div>
  );
};

export default ShareModal;
