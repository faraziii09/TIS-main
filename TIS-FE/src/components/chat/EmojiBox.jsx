import EmojiPicker from 'emoji-picker-react';
import { useEffect } from 'react';

const EmojiBox = ({handleClose, showEmojiBox, insertEmoji}) => {

    const handleClick = (e) => {
        console.log(showEmojiBox)
        if(!e.target.closest(".emoji-box") && showEmojiBox && !e.target.closest(".emoji-btn")){
            handleClose();
        }
    }

    const handleEmojiClick = (emojiData, e) => {
        insertEmoji(emojiData.emoji);
    }

    useEffect(() => {
        document.body.addEventListener("click", handleClick);

        return () => {
            document.body.removeEventListener("click", handleClick);
        }
    }, []);
    return <div className={`absolute emoji-box bottom-20 left-6`}>
        <EmojiPicker onEmojiClick={handleEmojiClick} lazyLoadEmojis={true} />
      </div>
}

export default EmojiBox;