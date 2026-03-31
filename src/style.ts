import { definePreset } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

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
                    400: '#D1D1D1'
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
                    200: '#2673B6',
                    300: '#3c763d',                         // green
                    400: '#a94442',                         // red
                    500: '#C80071',                         // --menu-pink
                    600: '#CBD5E1',
                    700: '#237623',
                    800: '#FF6651',
                    900: '#7f7f7f'
                },
                background: {
                    0: '#ffffff',                         // --background
                    50: '#F6F6F7',                         // --app-background card -color
                    100: '#F6F6F7',                               // background card
                    200: '#EAF0FF',                          // primary button text hover background
                    300: '#ffffff'                          // card bg
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
                    400: '#D1D1D1'
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
                    200: '#5da3df',
                    300: '#68E664',                         //green
                    400: '#ff8482',                         //red
                    500: '#C80071',                       // --d-menu-pink
                    600: '#4E535F',
                    700: '#9f9',
                    800: '#a62513',
                    900: '#7f7f7f'
                },
                background: {
                    0: '#1C1F27',                       // --d-background
                    50: '#E4E7F1',                       // --d-app-background card-color
                    100: '#4D5059',                      // background card
                    200: '#EAF0FF',                          // primary button text hover background
                    300: '#5d616c'                          //card bg
                }
            }
        }
    },
    components: {
        inputtext: {
            root: {
                background: '{surface.300}',
                disabledColor: '{text.0}'
            }
        },
        textarea: {
            root: {
                background: '{surface.300}',
                borderRadius: '4px',
                borderColor: '{accent.600}',
                focusRing: {
                    color: 'transparent'
                }
            },

        },
        select: {
            root: {
                borderRadius: '4px',
                borderColor: '{accent.600}',
                paddingY: '6px',
                paddingX: '12px',
                background: '{surface.300}',
                focusRing:{
                    width: '1px'
                }
            },
            option: {
                selectedColor: '{text.0}',
                selectedBackground: '{primary.50}',
                selectedFocusColor: '{text.0}',
                selectedFocusBackground: '{primary.50}',

            },
            overlay:{
                background: '{surface.50}'
            }
        },
        checkbox: {
            root: {
                background: '{surface.300}',
                width: '18px',
                height: '18px',
                checkedBackground: '{primary.100}',
                checkedBorderColor: '{primary.100}',
                checkedHoverBackground: '{primary.200}',
                checkedHoverBorderColor: '{primary.200}'
            }
        },
        selectbutton: {
            root: {
                borderRadius: '3px'
            }
        },
        togglebutton: {
            root: {
                background: '{background.100}',
                checkedBackground: '{primary.100}',
                checkedBorderColor: '{accent.600}',
                borderColor: '{accent.600}'
            }
        },
        paginator: {
            root: {
                background: '{neutral.700}'
            }
        },
        multiselect: {
            root: {
                borderRadius: '4px',
                borderColor: '{accent.600}',
                background: '{surface.300}'
            }
        },
        fileupload: {
            root:{
                background: '{surface.300}',
                borderRadius: '4px',
                borderColor: '{accent.600}'
            }
        },
        menu: {
            item: {
                padding: '0.7rem 0.75rem',
                focusBackground: '{primary.50}'
            }
        },
        accordion: {
            root:{
                transitionDuration: '',
            },
            header: {
                fontWeight: '100',
                activeBackground: 'transparent'
            },
            content: {
                padding: '0.8rem'
            }
        },
        datepicker: {
            dropdown: {
                borderColor: '{accent.600}'
            }
        },
        inputchips: {
            root: {
                background: '{surface.300}'
            }
        },
        label: {
            color: '{text.0}'
        },
        tabs: {
            tablist: {
                background: 'transparent'
            },
            tab: {
                background:'{surface.300}'
            }
        },
        popover: {
            root:{
                borderRadius: '4px',
                background: '{background.100}',
                color: '{text.0}',
            }
        },
        datatable: {
            headerCell :{
                selectedColor:'{primary.100}'
            },
            sortIcon:{
                hoverColor: '{text.0}'
            }
        },
        button: {
            root: {
                label: {
                    fontWeight: 'unset'
                }
            }
        }

    }
});

