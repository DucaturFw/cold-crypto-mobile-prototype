REACT_NATIVE_PACKAGER_HOSTNAME=$(ip -f inet addr show wifi0 | grep -Po 'inet \K[\d.]+') yarn start
