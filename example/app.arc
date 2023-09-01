@app
obelisk-arc-example

@http
any /*
any /api/*
get /thing/:id/*

@aws
runtime nodejs18.x
architecture arm64 # optional, but speedy
