PKG_DIR=$(realpath $(dirname "$npm_package_json"))

BUILD_DIR="$PKG_DIR/frontend/builds"
SRC_DIR="$PKG_DIR/frontend/src/paperOS"
OUT="$BUILD_DIR/paperOS.zip"

echo "cleaning $BUILD_DIR..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

echo "going into $SRC_DIR..."
cd "$SRC_DIR"

zip -r "$OUT" .

