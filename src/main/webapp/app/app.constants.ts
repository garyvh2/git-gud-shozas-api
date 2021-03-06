// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

export const VERSION = process.env.VERSION;
export const DEBUG_INFO_ENABLED: boolean = !!process.env.DEBUG_INFO_ENABLED;
export const SERVER_API_URL = process.env.SERVER_API_URL;
export const MOCK_SERVER_API_URL = 'https://6cd8c254-74c1-4b7f-a6b5-26cdfa38b6ae.mock.pstmn.io';
export const MAPS_API_KEY = 'AIzaSyBN4W3Ej_21icSVaTwxXoElWi_Qp4TQvN8';
export const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;

export const IP_LOCATION_API_KEY = '34ccd65f1f6a42' + '9d9e375216aa10edc1';
