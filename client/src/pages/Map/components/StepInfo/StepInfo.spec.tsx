
/**
 * @author Oleksandr Turytsia
 */
import { render, screen } from '@testing-library/react';
import StepInfo from './StepInfo';
import StepsContainer from '../StepsContainer/StepsContainer';
import { MapContext, MapContextType, SystemStatus } from '../../Map';
import { Map, Marker } from '../../../../utils/Map';
import { buildMap } from '../../../../hooks/useMap/useMap'
import ImageContent from './components/ImageContent/ImageContent';
import { StepInfoTest } from '../../../../utils/definitions';
import { initialMapContext } from '../../Map';
import L from 'leaflet'
import Location from './components/Locations/components/Location/Location';
import icons from '../../../../utils/icons';

// Mock the necessary modules using jest.mock()
jest.mock('./components/Locations/components/Location/Location');
jest.mock('../../../../hooks/useMap/useMap');
jest.mock('../../../../utils/utils')
jest.mock('./components/ImageContent/ImageContent', () => ({
  __esModule: true,
  default: jest.fn(), // Mock the default export of ImageContent
}));

describe('StepInfo', () => {
  beforeEach(() => {
    // Clear mock function mockReturnValue before each test
    jest.clearAllMocks();
  });

  it('StepContainer renders correctly', () => {

    // Mock the return value of buildMap
    (buildMap as jest.Mock).mockReturnValue({});

    // Mock the implementation of ImageContent
    (ImageContent as jest.Mock).mockImplementation(() => <>Image</>);

    // Render the component under test
    render(
      <StepsContainer>
        <StepInfo />
      </StepsContainer>
    );

    // Assert that the mocked component is rendered correctly
    expect(screen.getByTestId(StepInfoTest.stepContainer)).toBeInTheDocument();

    // Assert if SelectLocations step is active by default
    expect(screen.getByTestId(icons.location)).toHaveClass("current");

    // Assert if default image is displayed
    expect(screen.getByText(/image/i)).toBeInTheDocument();

    // Assert if a button to proceed with the next step is disabled
    expect(screen.getByTestId(StepInfoTest.buttonSaveChanges)).toHaveAttribute("disabled");
  });

  it('SelectLocations: Render list of markers', () => {

    const markers: Marker[] = [
      new Marker(new L.LatLng(40,40)),
      new Marker(new L.LatLng(40,40))
    ]

    const mapContextValue: MapContextType = {
      ...initialMapContext,
      markers
    };

    // Mock the return value of buildMap
    (buildMap as jest.Mock).mockReturnValue({});

    (Location as jest.Mock).mockImplementation(() => <div>Location</div>)

     // Render the component under test
     render(
      <MapContext.Provider value={mapContextValue}>
        <StepsContainer>
          <StepInfo />
        </StepsContainer>
      </MapContext.Provider>
    );

    expect(screen.getByTestId(StepInfoTest.locationsContainer).children.length).toBe(markers.length);

    // Assert if a button to proceed with the next step is disabled
    expect(screen.getByTestId(StepInfoTest.buttonSaveChanges)).not.toHaveAttribute("disabled");
  })

  it('defineLocationAttributes: Default state', () => {

    const systemStatus = SystemStatus.defineLocationAttributes

    const markers: Marker[] = [
      new Marker(new L.LatLng(40,40)),
      new Marker(new L.LatLng(40,40))
    ]

    const mapContextValue: MapContextType = {
      ...initialMapContext,
      systemStatus,
      markers
    };

    // Mock the return value of buildMap
    (buildMap as jest.Mock).mockReturnValue({});

    (Location as jest.Mock).mockImplementation(() => <div>Location</div>)

     // Render the component under test
    render(
      <MapContext.Provider value={mapContextValue}>
        <StepsContainer>
          <StepInfo />
        </StepsContainer>
      </MapContext.Provider>
    );

    // Assert if SelectLocations step is done
    expect(screen.getByTestId(icons.location)).toHaveClass("done");

    // Assert if defineLocationAttributes step is active
    expect(screen.getByTestId(icons.attributes)).toHaveClass("current");

    // Assert if locations are visiable
    expect(screen.getByTestId(StepInfoTest.locationsContainer).children.length).toBe(markers.length);

    // Assert if a button to proceed with the next step is disabled
    expect(screen.getByTestId(StepInfoTest.buttonSaveChanges)).toHaveAttribute("disabled");
  })

  it('defineLocationAttributes: Inputs correctly filled by the user', () => {

    const marker = new Marker(new L.LatLng(40,40))

    marker.setAttributes([
      {
        key: "key1",
        value: "10",
        maxValue: "100"
      },
      {
        key: "key2",
        value: "10",
        maxValue: "100"
      },
      {
        key: "key3",
        value: "10",
        maxValue: "100"
      }
    ])

    const systemStatus = SystemStatus.defineLocationAttributes

    const mapContextValue: MapContextType = {
      ...initialMapContext,
      systemStatus,
      markers: [marker, marker]
    };

    // Mock the return value of buildMap
    (buildMap as jest.Mock).mockReturnValue({});

    (Location as jest.Mock).mockImplementation(() => <div>Location</div>)

     // Render the component under test
    render(
      <MapContext.Provider value={mapContextValue}>
        <StepsContainer>
          <StepInfo />
        </StepsContainer>
      </MapContext.Provider>
    );
    
    // Assert if defineLocationAttributes step is active
    expect(screen.getByTestId(icons.attributes)).toHaveClass("current");

    // Assert if a button to proceed with the next step is not disabled, because inputs are filled
    expect(screen.getByTestId(StepInfoTest.buttonSaveChanges)).not.toHaveAttribute("disabled");
  })

  it('defineLocationAttributes: In attributes max. value is lower than the value', () => {

    const marker = new Marker(new L.LatLng(40,40))
    const markerWithError = new Marker(new L.LatLng(40,40))

    marker.setAttributes([
      {
        key: "key1",
        value: "10",
        maxValue: "100"
      },
      {
        key: "key2",
        value: "10",
        maxValue: "100"
      },
      {
        key: "key3",
        value: "10",
        maxValue: "100"
      }
    ])

    markerWithError.setAttributes([
      {
        key: "key1",
        value: "101",
        maxValue: "100"
      },
      {
        key: "key2",
        value: "10",
        maxValue: "100"
      },
      {
        key: "key3",
        value: "10",
        maxValue: "100"
      }
    ])

    const systemStatus = SystemStatus.defineLocationAttributes

    const mapContextValue: MapContextType = {
      ...initialMapContext,
      systemStatus,
      markers: [markerWithError, marker]
    };

    // Mock the return value of buildMap
    (buildMap as jest.Mock).mockReturnValue({});

    (Location as jest.Mock).mockImplementation(() => <div>Location</div>)

     // Render the component under test
    render(
      <MapContext.Provider value={mapContextValue}>
        <StepsContainer>
          <StepInfo />
        </StepsContainer>
      </MapContext.Provider>
    );
    
    // Assert if SelectLocations step is active by default
    expect(screen.getByTestId(icons.attributes)).toHaveClass("current");

    // Assert if a button to proceed with the next step is not disabled, because inputs are filled
    expect(screen.getByTestId(StepInfoTest.buttonSaveChanges)).toHaveAttribute("disabled");
  })

  it('defineLocationAttributes: Attributes have the same keys', () => {

    const marker = new Marker(new L.LatLng(40,40))

    marker.setAttributes([
      {
        key: "key1",
        value: "10",
        maxValue: "100"
      },
      {
        key: "key2",
        value: "10",
        maxValue: "100"
      },
      {
        key: "key2",
        value: "10",
        maxValue: "100"
      }
    ])

    const systemStatus = SystemStatus.defineLocationAttributes

    const mapContextValue: MapContextType = {
      ...initialMapContext,
      systemStatus,
      markers: [marker, marker]
    };

    // Mock the return value of buildMap
    (buildMap as jest.Mock).mockReturnValue({});

    (Location as jest.Mock).mockImplementation(() => <div>Location</div>)

     // Render the component under test
    render(
      <MapContext.Provider value={mapContextValue}>
        <StepsContainer>
          <StepInfo />
        </StepsContainer>
      </MapContext.Provider>
    );
    
    // Assert if SelectLocations step is active by default
    expect(screen.getByTestId(icons.attributes)).toHaveClass("current");

    // Assert if a button to proceed with the next step is not disabled, because inputs are filled
    expect(screen.getByTestId(StepInfoTest.buttonSaveChanges)).toHaveAttribute("disabled");
  }),
  it('compareLocationAttributes: Default state', () => {

    const marker = new Marker(new L.LatLng(40,40))

    const systemStatus = SystemStatus.compareLocationAttributes

    const mapContextValue: MapContextType = {
      ...initialMapContext,
      systemStatus,
      markers: [marker, marker],
      map: {
        getMarkers: jest.fn(() => [marker, marker]),
      } as unknown as Map,
    };

    // Mock the return value of buildMap
    (buildMap as jest.Mock).mockReturnValue({});

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (Location as jest.Mock).mockImplementation(() => <div>Location</div>)

    // (useContext as jest.Mock).mockImplementation(() => ({ map: {}, score: {} }))

     // Render the component under test
    render(
      <MapContext.Provider value={mapContextValue}>
        <StepsContainer>
          <StepInfo />
        </StepsContainer>
      </MapContext.Provider>
    );
    
    // Assert if SelectLocations step is active by default
    expect(screen.getByTestId(icons.compare)).toHaveClass("current");

    // Assert if a button to proceed with the next step is not disabled, because inputs are filled
    expect(screen.getByTestId(StepInfoTest.buttonSaveChanges)).not.toHaveAttribute("disabled");
  })
  it('resultLocations: Default state', () => {

    const marker = new Marker(new L.LatLng(40,40))

    const systemStatus = SystemStatus.resultLocations

    const markers = [marker, marker]

    const mapContextValue: MapContextType = {
      ...initialMapContext,
      systemStatus,
      markers,
      map: {
        getMarkers: jest.fn(() => markers),
      } as unknown as Map,
    };

    // Mock the return value of buildMap
    (buildMap as jest.Mock).mockReturnValue({});

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (Location as jest.Mock).mockImplementation(() => <div>Location</div>)

    // (useContext as jest.Mock).mockImplementation(() => ({ map: {}, score: {} }))

     // Render the component under test
    render(
      <MapContext.Provider value={mapContextValue}>
        <StepsContainer>
          <StepInfo />
        </StepsContainer>
      </MapContext.Provider>
    );
    
    // Assert if SelectLocations step is active by default
    expect(screen.getByTestId(icons.done)).toHaveClass("current");

    // Assert if locations are visiable
    expect(screen.getByTestId(StepInfoTest.locationsContainer).children.length).toBe(markers.length);

    // Assert if a button to proceed with the next step is not disabled, because inputs are filled
    expect(screen.getByTestId(StepInfoTest.buttonSaveChanges)).not.toHaveAttribute("disabled");
  })
});