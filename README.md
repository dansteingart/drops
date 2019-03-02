# Wait For The Drop(s)

This is a simple node based replacement for [pyDrops](https://github.com/dansteingart/pyDrop) which is/was a self-hosted python replacement for the excellent but now long gone [drop.io](https://en.wikipedia.org/wiki/Drop.io).

Better yet: go to a URL path. Does it exist? No? No biggie. Now it does. Now drag/drop or click to upload a file. Super. Now you've uploaded something to share with those with whom you need to share things. That's it. Well almost.

# Run as Docker
This is really designed to be run in a docker pointed in a useful way to your file system. To just use the docker image, pull [this](https://hub.docker.com/r/steingart/drops/) bad boy.

The docker image always uses the head of this repo.

To run the docker image type
  ```
  docker run -p 8200:8000 \
  -v /path/to/files/:/filez/ \
  -dit --name drops steingart/drops
```

where `8200` is the port which is available on your host, and `/path/to/files` is where you want to store the dropped files on your host, and `drops` is what I named the container. These can all change. Everything else should be the same.

The docker literate amoung you will note that the `-p` is no good. Agreed. Better to use a [reverse proxy](https://hub.docker.com/r/steingart/redbird) and point it to the container, so you might start the docker container like this:

  ```
  docker run --network YOURNET --ip 10.0.0.200 \
  -v /path/to/files/:/filez/ \
  -dit --name drops steingart/drops
```

then just point the reverse proxy to port `8000` on `10.0.0.200` and you're golden.

If you the run the container using the above a username/password is autogenerated `every time you restart the app`. This is safe or something.

to see the username/password type

```
docker logs drops
```

**if you want to set a username/password**, use these environment variables.  

```
docker run --network YOURNET --ip 10.0.0.200 \
-v /path/to/files/:/filez/ \
-e GEN_USER=usernamemakeitdifficult \
-e GEN_PASS=passwordmakeitevenmoredifficult \
-dit --name drops steingart/drops
```
this is the equivalent of, within the operating system, saying at run time
```
export GEN_USER=usernamemakeitdifficult
export GEN_PASS=passwordmakeitevenmoredifficult
```


**A node on authentication**: to see directory contents/upload anything you need to enter the username/password. To see a direct file line _you do not_ need a username/password. The idea here is that direct link to files are useful for emails, and if someone has the full url we assume they should be able to see the file. But without the user/pass combo they cannot peruse the drops nor upload files.

Don't like it?  You've got the code [here](https://github.com/dansteingart/drops) cowperson, change it!

#Run Without Docker
See above. If you really must run uncontainerized for whatever reason, the program will try to write to `/filez/` as a base directory. If `/filez/` is not to your liking, go to line 27.
