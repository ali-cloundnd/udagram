import sys
import cv2
import numpy as np
import os

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
    Exception : when there is a problem with IO or cs.Canny
    """
    img = cv2.imread(img_path, flag);
    if img.size == 0:
        raise Exception('Unable to read image file')

    edges = cv2.Canny(img, minVal, maxVal)
    if edges.size == 0:
        raise Exception('Failed to extract edges')

    status = cv2.imwrite(img_path + ".edge.jpg", edges)
    if (not status):
        raise Exception('Unable to write edge file')

    return img_path + ".edge.jpg"


if __name__ == '__main__':
    try:
        if os.name is 'posix':
            os.setuid(os.geteuid())
        img_path = sys.argv[1];
        edge_path = cannyWrapper(img_path)

        # using print will add \r\n to the end of the path
        sys.stdout.write(edge_path)
    except:
        sys.stdout.write("ERROR")
    
    sys.stdout.flush()