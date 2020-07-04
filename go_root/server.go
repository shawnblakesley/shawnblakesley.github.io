package main

import (
	"bufio"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/NYTimes/gziphandler"
)

var (
	logPath  = "/var/log/server/server.log"
	certPath = "/etc/letsencrypt/live/shawn.blakesley.io/"
	debug    = flag.Bool("debug", false, "run in debug mode")
	port     = flag.String("port", ":80", "which port to run the server on")
	dir      = flag.String("dir", "/static/", "http directory to use")
)

func exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return true, err
}

func waitForEscape() {
	reader := bufio.NewReader(os.Stdin)
	reader.ReadString('\n')
}

func redirect(w http.ResponseWriter, req *http.Request) {
	original := "http://" + req.Host + req.RequestURI
	target := "https://blakesley.dev" + req.RequestURI
	log.Printf("redirect from %s to: %s", original, target)
	http.Redirect(w, req, target, http.StatusTemporaryRedirect)
}

func maxAgeHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		seconds := 604800
		if strings.HasSuffix(r.RequestURI, "jpg") || strings.HasSuffix(r.RequestURI, "js") || strings.HasSuffix(r.RequestURI, "png") || strings.HasSuffix(r.RequestURI, "svg") || strings.HasSuffix(r.RequestURI, "css") || strings.HasSuffix(r.RequestURI, "gif") {
			w.Header().Add("Cache-Control", fmt.Sprintf("max-age=%d, public, must-revalidate, proxy-revalidate", seconds))
		}
		h.ServeHTTP(w, r)
	})
}

func main() {
	flag.Parse()
	if *debug {
		logPath = "logs/server.log"
	}
	f, err := os.OpenFile(logPath, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	log.SetOutput(f)
	log.Println("Serving static files from", *dir)
	log.Println("Server is listening on port", *port)
	http.Handle("/api/", http.HandlerFunc(serveAPI))
	http.Handle("/", gziphandler.GzipHandler(maxAgeHandler(http.FileServer(http.Dir(*dir)))))
	if *debug {
		go http.ListenAndServe(*port, nil)
		waitForEscape()
	} else {
		cert := path.Join(certPath, "cert.pem")
		key := path.Join(certPath, "privkey.pem")
		certExists, _ := exists(cert)
		keyExists, _ := exists(key)
		if certExists && keyExists {
			go http.ListenAndServe(*port, http.HandlerFunc(redirect))
			err := http.ListenAndServeTLS(":443", cert, key, nil)
			if err != nil {
				log.Println("ListenAndServeTLS: ", err)
			}
		} else {
			log.Println("Warning: certs not found. Running on http")
			err := http.ListenAndServe(*port, nil)
			if err != nil {
				log.Println("ListenAndServe: ", err)
			}
		}
	}
}

func serveAPI(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("This will be an api for... something...\n"))
}
