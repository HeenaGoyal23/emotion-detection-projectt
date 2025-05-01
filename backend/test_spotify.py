try:
    from moviepy.editor import VideoFileClip
    print("MoviePy is working!")
except ImportError:
    print("MoviePy is not installed correctly.")
