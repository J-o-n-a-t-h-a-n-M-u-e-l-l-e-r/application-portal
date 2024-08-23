# No-PWA Application Portal

This branch contains the no-PWA version of the application portal, which was used for comparison with the network-optimized PWA version in the experiments of the thesis.

## Changes from the Network-Optimized PWA

This version was created by branching off from the network-optimized PWA version and then removing every PWA-related feature. This includes the following changes:

- Removed the service worker
- Removed the manifest file
- Removed any form of prefetching
- Stopped persisting the Pinia store state in local storage
