import sys
import cv2
import numpy as np

def cannyWrapper(img_path, flag=0, minVal=100, maxVal=200):
    """Open the image, runs Canny and saves the edge image locally

    Parameters
    ----------
    img_path : an absolute path to an image locally saved file
    flag : flag argument for cs2.imread
        Default to 0; read as greyscale
    minVal : first threshold for cs2.Canny
        Default to 100
    maxVal : second threshold for cs2.Canny
        Default to 200   

    Returns
    ------
    edge_path : str
        an absolute path to a the edge image locally saved file

    Raises
    ------
    Exception : when there is a problem with IO
    """
    img = cv2.imread(img_path, flag);

    if img.size == 0:
        raise Exception('Unable to read image file')

    edges = cv2.Canny(img, minVal, maxVal)
    status = cv2.imwrite(img_path + ".edge.jpg", edges)

    if (status):
        return img_path + ".edge.jpg"
    else:
        raise Exception('Unable to write edge file')


if __name__ == '__main__':
    try:
        img_path = sys.argv[1];
        edge_path = cannyWrapper(img_path)

        # using print will add \r\n to the end of the path
        sys.stdout.write(edge_path)
    except:
        sys.stdout.write("ERROR")
    
    sys.stdout.flush()