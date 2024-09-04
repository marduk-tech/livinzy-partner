import { useMediaQuery } from "react-responsive";

/**
 * Custom hook to determine device type based on screen size
 * @returns An object with boolean flags for device types
 */
function useDevice() {
  // Check if the device is a tablet or mobile (max-width: 992px)
  const isTabletOrMobile = useMediaQuery({
    query: "(max-width: 992px)",
  });

  // Check if the device is a mobile (max-width: 576px)
  const isMobile = useMediaQuery({
    query: "(max-width: 576px)",
  });

  // Return an object with the device type flags
  return {
    isTabletOrMobile,
    isMobile,
  };
}

// Export the useDevice hook for use in other modules
export { useDevice };
