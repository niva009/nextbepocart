import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import { IoExpandOutline } from 'react-icons/io5';
import { useState } from "react";

interface ImgGalleryProps {
    gallery: any[]; // array of image URLs
    startIndex?: number; // index to start from when lightbox is opened
}

const ImageLightBox: React.FC<ImgGalleryProps> = ({ gallery, startIndex = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(startIndex); // Use startIndex to control opening image

    // Map gallery to slides format for Lightbox
    const slidesGallery = gallery?.map((image) => ({
        src: image
    }));

    // Function to open the Lightbox with a specific image
    const handleOpenLightbox = (index: number) => {
        setPhotoIndex(index); // Set the starting index
        setIsOpen(true); // Open the Lightbox
    };

    return (
        <div className="absolute top-1 pe-5 z-10">
            {/* Open Lightbox Button */}
            <button type="button" onClick={() => handleOpenLightbox(photoIndex)}>
                <IoExpandOutline className="text-3xl" />
            </button>

            {/* Lightbox */}
            {isOpen && (
                <Lightbox
                    open={isOpen}
                    close={() => setIsOpen(false)}
                    slides={slidesGallery}
                    currentIndex={photoIndex} // Ensure the lightbox opens at the selected index
                    plugins={[Captions, Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
                />
            )}
        </div>
    );
};

export default ImageLightBox;
