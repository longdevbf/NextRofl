services:
  mycontainer:
    build: .
    image: "docker.io/longdevdatabase/mini_prj"      # Always provide FQDN image names!
    platform: linux/amd64
    volumes:
      - my-volume:/root/.my-volume              # Persistent per-machine storage.
      - /run/rofl-appd.sock:/run/rofl-appd.sock # appd REST API.
    environment:
      - CONTRACT_ADDRESS=0x9Fffa6da709222eecE882e70FF2e8F9865c045f8

volumes:
  my-volume:

