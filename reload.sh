podman build -t portfolio:latest .
podman compose down -v
podman compose up -d 
# rm -rf drizzle/
# bun run db:generate
# bun run db:migrate
# bun seed.sh
