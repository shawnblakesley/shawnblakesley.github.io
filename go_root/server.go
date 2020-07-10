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
	"time"

	"github.com/NYTimes/gziphandler"
	"github.com/gorilla/mux"
)

var (
	logPath  = "/var/log/server/server.log"
	certPath = "/etc/letsencrypt/live/shawn.blakesley.io/"
	debug    = flag.Bool("debug", false, "run in debug mode")
	port     = flag.String("port", ":443", "which port to run the server on")
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
	log.Println("Waiting for newline...")
	reader := bufio.NewReader(os.Stdin)
	_, err := reader.ReadString('\n')
	if err != nil {
		log.Println("Error reading newline:", err)
	}
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

func setupServer() *http.Server {
	router := mux.NewRouter()
	router.Handle("/api/", http.HandlerFunc(serveAPI))
	getRouter := router.Methods("GET").Subrouter()
	getRouter.PathPrefix("/").Handler(gziphandler.GzipHandler(maxAgeHandler(http.FileServer(http.Dir(*dir)))))
	srv := &http.Server{
		Handler:      router,
		Addr:         *port,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	return srv
}

func launchServer(server *http.Server) {
	cert := path.Join(certPath, "cert.pem")
	key := path.Join(certPath, "privkey.pem")
	certExists, _ := exists(cert)
	keyExists, _ := exists(key)
	if certExists && keyExists {
		log.Println("Server is listening on", server.Addr)
		go func() { log.Fatal(http.ListenAndServe(":80", http.HandlerFunc(redirect))) }()
		log.Fatal(server.ListenAndServeTLS(cert, key))
	} else {
		server.Addr = ":80"
		log.Println("Warning: certs not found. Running on http", server.Addr)
		log.Fatal(server.ListenAndServe())
	}
}

func launchDebugServer(server *http.Server) {
	log.Println("DEBUG server is listening on", server.Addr)
	go func() { log.Fatal(server.ListenAndServe()) }()
	waitForEscape()
}

func main() {
	flag.Parse()
	log.Println("Serving static files from", *dir)
	var f *os.File
	if *debug {
		log.SetOutput(os.Stdout)
		srv := setupServer()
		launchDebugServer(srv)
		return
	}
	f, err := os.OpenFile(logPath, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if err != nil {
		log.Fatal(err)
	}
	log.SetOutput(f)
	defer f.Close()
	srv := setupServer()
	launchServer(srv)
}

func serveAPI(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("This will be an api for... something...\n"))
	if err != nil {
		log.Println("Error serving api:", err)
	}
}
