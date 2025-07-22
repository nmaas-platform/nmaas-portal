import { definePreset } from '@primeng/themes';
import Nora from '@primeng/themes/nora';

export const MyPreset = definePreset(Nora, {
    semantic: {
        colorScheme: {
            light: {
                primary: {
                    50: '#EAF0FF',                         // --primary-text-button-background-hover
                    100: '#3767BE',                        // --primary-button-color
                    200: '#32559B',                        // --primary-button-hover
                    300: '#3767BE',                        // --primary-text-button-color
                    400: '#32559B',                        // --primary-text-button-text-hover
                    500: '#64748B',                        // --secondary-button-color
                    600: '#475569',                        // --secondary-button-hover
                    700: '#64748B',                        // --secondary-text-button-color
                    800: '#475569',                        // --secondary-text-button-text-hover
                    900: '#CB433F'                         // --danger-button-color
                },
                surface: {
                    0: '#ffffff',
                    50: '#ffffff',                         // --background
                    100: '#F6F6F7',                        // --card-color
                    200: '#F2F4F7',                         // --menu-color
                    300: '#FFFFFF',
                },
                text: {
                    0: '#233354',                          // --l-text-color
                    50: '#233354',                          // --app-text-color
                    100: '#ffffff',                          // button text color
                    200: '#32559B',                           // app details links
                    300: '#142548'                          // tag text color
                },
                neutral: {
                    500: '#64748B',                        // --secondary-button-color
                    600: '#475569',                         // --secondary-button-hover'
                    700: 'transparent'
                },
                danger: {
                    500: '#CB433F',                        // --danger-button-color
                    600: '#A40400',                        // --danger-button-hover
                    700: '#FEF2F2'                         // --danger-text-button-background-hover
                },
                accent: {
                    500: '#C80071',                         // --menu-pink
                    600: '#CBD5E1',
                },
                background: {
                    0: '#ffffff',                         // --background
                    50: '#F6F6F7',                         // --app-background card -color
                    100: '#F6F6F7',                               // background card
                    200: '#EAF0FF'                          // primary button text hover background
                }
            },
            dark: {
                primary: {
                    50: '#5B9FFF',                        // --d-primary-text-button-background-hover
                    100: '#75AEFF',                       // --d-primary-button-color
                    200: '#4880D0',                       // --d-primary-button-hover
                    300: '#A1CDFF',                       // --d-primary-text-button-color
                    400: '#32559B',                       // --d-primary-text-button-text-hover
                    500: '#DFDFDF',                       // --d-secondary-button-color
                    600: '#B6B6B6',                       // --d-secondary-button-hover
                    700: '#DFDFDF',                       // --d-secondary-text-button-color
                    800: '#475569',                       // --d-secondary-text-button-text-hover
                    900: '#E2625F'                        // --d-danger-button-color
                },
                surface: {
                    0: '#ffffff',
                    50: '#1C1F27',                       // --d-background
                    100: '#4D5059',                      // --d-card-color
                    200: '#3C3F47',                       // --d-menu-color
                    300: '#3C3F47',
                },
                text: {
                    0: '#ffffff',                        // --d-text-color
                    50: '#233354',                        // --d-app-text-color
                    100: '#233354',                         // button text color
                    200: '#ffffff',                         // app details links
                    300: '#1C1F27'                          // tag text color
                },
                neutral: {
                    500: '#DFDFDF',                      // --d-secondary-button-color
                    600: '#B6B6B6',                       // --d-secondary-button-hover
                    700: 'transparent'
                },
                danger: {
                    500: '#E2625F',                      // --d-danger-button-color
                    600: '#CB433F',                      // --d-danger-button-hover
                    700: '#FEF2F2'                       // --d-danger-text-button-background-hover
                },
                accent: {
                    500: '#C80071',                       // --d-menu-pink
                    600: '#4E535F',
                },
                background: {
                    0: '#1C1F27',                       // --d-background
                    50: '#E4E7F1',                       // --d-app-background card-color
                    100: '#4D5059',                      // background card
                    200: '#EAF0FF'                          // primary button text hover background
                }
            }
        }
    },
    components: {
        inputtext: {
            background: '{surface.300}'
        },
        textarea: {
          background: '{surface.300}',
          border: {
              radius: '4px',
              color: '{accent.600}'
          }
        },
        select: {
            background: '{surface.300}',
            overlay: {
                background: '{surface.50}'
            },
            option: {
                selected: {
                    color: '{text.0}',
                    background: '{primary.50}',
                    focus: {
                        color: '{text.0}',
                        background: '{primary.50}'
                    }
                }
            }
        },
        checkbox: {
            width: '20px',
            height: '20px',
            checked: {
                background: '{primary.100}',
                border: {
                    color: '{primary.100}',
                },
                hover: {
                    background: '{primary.200}',
                    border: {
                        color: '{primary.200}',
                    }
                }
            }
        },
        selectbutton: {
            borderRadius: '3px',
        },
        togglebutton: {
            background: '{background.100}',
            checked: {
                background: '{primary.100}',
                border: {
                    color: '{accent.600}',
                }
            },
            border: {
                color: '{accent.600}',
            }
        },
        paginator: {
            background: '{neutral.700}',
        },
        multiselect: {
            border: {
                radius: '4px',
                color: '{accent.600}',
            },
            background: '{surface.300}'
        },
        fileupload: {
            background: '{surface.300}',
            border: {
                radius: '4px',
                color: '{accent.600}'
            }
        }
    }
});

