Following are the most common errors most likely to encounter while using Django-channels.

- The Solution to all of them are given below

1 - While installing channels (pip instal channels):
    Twisted might raise error if using python 3.8 as the twist does not have some stable version of channels and Twisted
    Out of the box. IN that CASE just shift your virtual env to python 3.7.
2 - Another Error is configuring the Redis -- Redis is does not supported on windows. So install the Memurai from
        https://www.memurai.com/get-memurai
    - Download
    - Install
    - Go Task Manger > Services
    -- Look For "Memurai"
    -- Start it if Stopped

