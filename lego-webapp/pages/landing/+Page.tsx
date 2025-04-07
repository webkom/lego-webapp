import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect } from 'react';
import Banner from '~/components/Banner';
import { fetchCurrentPrivateBanner, fetchCurrentPublicBanner } from '~/redux/actions/BannerActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectCurrentPrivateBanner, selectCurrentPublicBanner } from '~/redux/slices/banner';

// Rest of your imports...

const LandingPage = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  
  // Fetch the appropriate banner based on login status
  usePreparedEffect(
    'fetchLandingPageBanner',
    () => {
      try {
        if (isLoggedIn) {
          return dispatch(fetchCurrentPrivateBanner());
        } else {
          return dispatch(fetchCurrentPublicBanner());
        }
      } catch (error) {
        console.error('Error fetching banner:', error);
        return Promise.resolve(); // Return resolved promise on error
      }
    },
    [dispatch, isLoggedIn]
  );
  
  // Select the appropriate banner
  const privateBanner = useAppSelector(selectCurrentPrivateBanner);
  const publicBanner = useAppSelector(selectCurrentPublicBanner);
  
  // Choose which banner to display
  const currentBanner = isLoggedIn ? privateBanner : publicBanner;
  
  return (
    <div>
      {/* Display banner if exists and has required properties */}
      {currentBanner && currentBanner.header && (
        <Banner
          header={currentBanner.header}
          subHeader={currentBanner.subheader}
          link={currentBanner.link}
          color={currentBanner.color}
          countdownEndDate={currentBanner.countdownEndDate ? new Date(currentBanner.countdownEndDate) : undefined}
          countdownEndMessage={currentBanner.countdownEndMessage}
        />
      )}
      
      {/* Rest of your landing page content */}
    </div>
  );
};

export default LandingPage;
