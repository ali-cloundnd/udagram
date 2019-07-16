import sys
import cv2
import numpy as np
import string
import random

# import any special Python 2.7 packages
if sys.version_info.major == 2:
    import urllib as ur

# import any special Python 3 packages
elif sys.version_info.major == 3:
    import urllib.request as ur

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    """ Generate a random string of given size """
    return ''.join(random.choice(chars) for _ in range(size))

def url_to_image(url):
    """ download the image, convert it to a NumPy array, and then read it into OpenCV format """
    req = ur.Request(url, headers={'User-Agent' : "Magic Browser"})
    resp = ur.urlopen(req)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    if (gray is None):
        raise Exception('Unable to read image from URL')
    return gray

def cannyWrapper(img, minVal=100, maxVal=200):
    """ Runs Canny return the edge image 
        img : an OpenCV image in grayscale
        minVal & maxVal: are threshold for cs2.Canny
    """
    edges = cv2.Canny(img, minVal, maxVal)
    if (edges is None):
        raise Exception('Failed to extract edges')
    return edges


def save_to_disk(img, folder):
    """ Saves the img to folder, assigning it a random name
        Returns the image file name
    """
    name = folder + "/" + id_generator() + ".jpg"
    status = cv2.imwrite(name, img)
    if (not status):
        raise Exception('Unable to write edge file')
    return name


if __name__ == '__main__':
    try:
        url = sys.argv[1]
        folder = sys.argv[2]
        img = url_to_image(url)
        edge = cannyWrapper(img)
        path = save_to_disk(edge, folder)
        # using print will add \r\n to the end of the path
        sys.stdout.write(path)
    except Exception as e: 
        print(e);
        # sys.stdout.write("ERROR")
    
    sys.stdout.flush()