module.exports = {
    version: 1,
    labels: {
        alphabet: 'abcdefghijklmnopqrstuvwxyz0123456789',
        font: '16px monospace',
        padding: [4, 3, 3, 5],
        blink_interval: 600,
        on_scroll: 'restore',
        exit_on_resize: true,
        fill_color: 'yellow',
        text_color: 'red',
        stroke_styles: [
            { selector: 'a', style: '#00F' },
            { selector: 'img', style: '#0C0' },
            { selector: 'video,audio', style: '#F00' },
            { selector: '*', style: '#333' },
        ],
    },

    hotkeys: [
        {
            binding: 'f',
            action: 'start-input',
            global: false,
            value: '',
            preventDefault: true,
        },

        {
            binding: 'shift+f',
            action: 'start-instant',
            global: false,
            value: '',
            preventDefault: true,
        },

        {
            binding: 'f2 c',
            action: 'clear-messages',
            global: true,
            value: '',
            preventDefault: true,
        },

        {
            binding: 'f2 e',
            action: 'leave-focus',
            global: true,
            value: '',
            preventDefault: true,
        },

        /*
        {
            binding: 'ctrl+e',
            action: 'leave-focus',
            global: true,
            value: '',
            preventDefault: true,
        }, */


        {
            binding: 'f2 2',
            action: 'start-input',
            global: true,
            value: '',
            preventDefault: true,
        },

        {
            binding: 'f2 f2',
            action: 'start-instant',
            global: true,
            value: '',
            preventDefault: true,
        },

        {
            binding: 'f2 3',
            action: 'start-instant',
            global: true,
            value: '=',
            preventDefault: true,
        },

        {
            binding: 'f2 o',
            action: 'turn-off',
            global: true,
            value: '',
            preventDefault: true,
        }
        ,
        {
            binding: 'f2 p',
            action: 'turn-off-page',
            global: true,
            value: '',
            preventDefault: true,
        },

        {
            binding: 'f2 d',
            action: 'turn-off-domain',
            global: true,
            value: '',
            preventDefault: true,
        },

        {
            binding: 'f2 h',
            action: 'show-help',
            global: true,
            value: '',
            preventDefault: true,
        },
    ],

    selectors: [
        {
            pattern: { type: 'match-regexp', value: '/[^]*/' },
            action: 'include',
            selector: 'a,input:not([type=hidden]),img,iframe,video,audio,textarea,button,select,[onclick],[class*=tab],[class*=btn],[class*=button],[id*=tab],[id*=btn],[id*=button],[id*=menu],[class*=menu],h1,h2,h3,h4,h5,h6',
        },
        {
            pattern: { type: 'match-regexp', value: '/[^]*/' },
            action: 'exclude',
            selector: '[disabled],[style*="visibility: hidden"]'
        },
    ],

    // Actions
    modifiers: {
        '':  [ { action: 'autodetect',       user_args: 'ignore', args: [] } ],
        '-': [ { action: 'open_in_new_tab',  user_args: 'ignore', args: [] }],
        '_': [ { action: 'open_in_new_tab',  user_args: 'ignore', args: ['inactive'] }],
        '~': [ { action: 'open_in_this_tab', user_args: 'ignore', args: [] }],
        '|': [ { action: 'set_value',        user_args: 'accept', args: [] }],
        '^': [ { action: 'focus',            user_args: 'ignore', args: [] }],
        ',': [ { action: 'click',            user_args: 'ignore', args: [] }],
        '=': [ { action: 'copy_contents',    user_args: 'prepend', args:['value', 'textContent'] }],
        '\\':[ { action: 'copy_contents',    user_args: 'prepend', args:['innerHTML'] }],
        '+': [ { action: 'copy_contents',    user_args: 'prepend', args:['href', 'src'] }],
        '*': [ { action: 'copy_contents',    user_args: 'prepend', args:['imageData'] }],
        '.': [ { action: 'copy_contents',    user_args: 'prepend', args:['originalDataURL'] }],
        '/': [ { action: 'copy_contents',    user_args: 'prepend', args:['dataURL'] }],
        '%': [ { action: 'remove',           user_args: 'prepend', args: [] }],
        '!': [ { action: 'mute',             user_args: 'ignore', args: [] } ],
        '@': [ { action: 'toggle_pause',     user_args: 'ignore', args: [] } ],
        '#': [ { action: 'trigger_events',   user_args: 'ignore', args: ['mouseover', 'mouseenter'] }],
        '$': [ { action: 'trigger_events',   user_args: 'ignore', args: ['mouseleave', 'mouseout'] }],
        '&': [ { action: 'trigger_events',   user_args: 'ignore', args: ['click'] }],
        ';': [ { action: 'download',         user_args: 'accept', args: [] }],
        ':': [ { action: 'download',         user_args: 'accept', args: ['saveAs'] }],
        '>': [ { action: 'set_value',        user_args: 'accept', args: [] },
               { action: 'focus',            user_args: 'ignore', args: [] }],
        '?': [ { action: 'show_help',        user_args: 'ignore', args: [] }],

        '"': [],
        '<': [],

        'nt': [ { action: 'open_in_new_tab',  user_args: 'ignore', args: [] }],
        'it': [ { action: 'open_in_new_tab',  user_args: 'ignore', args: ['inactive'] }],
        'sv': [ { action: 'set_value',        user_args: 'accept', args: [] }],
        'fs': [ { action: 'focus',            user_args: 'ignore', args: [] }],
        'cc': [ { action: 'copy_contents' ,   user_args: 'ignore', args: ['value', 'textContent'] }],
        'cs': [ { action: 'copy_contents' ,   user_args: 'ignore', args: ['href', 'src'] }],
        'ci': [ { action: 'copy_contents' ,   user_args: 'ignore', args: ['imageData'] }],
        'cu': [ { action: 'copy_contents' ,   user_args: 'ignore', args: ['originalDataURL'] }],
        'rm': [ { action: 'remove',           user_args: 'prepend', args: [] }],
        'mt': [ { action: 'mute',             user_args: 'ignore', args: [] } ],
        'ps': [ { action: 'toggle_pause',     user_args: 'ignore', args: [] } ],
        'dl': [ { action: 'download',         user_args: 'accept', args: [] }],
        'sa': [ { action: 'download',         user_args: 'accept', args: ['saveAs'] }],
    },

    autodetection: [
        { selector: 'a[target=_blank]', action: 'open_in_new_tab' },
        { selector: 'input[type=text], input[type=password], textarea, select', action: 'focus' },
        { selector: 'video, audio', action: 'toggle_pause' },
        { selector: 'img', action: 'open_in_new_tab' },
        { selector: '*', action: 'click' },
    ],

    startup_preferences: [
        /*
           { pattern: { type, value },
             value, action }
         */
    ],

    keymap: {
    },

    keymap_preferences: [],

    autoclose_quotes: true,
    autoclose_brackets: false,
    input_top: false,

    input_style:  {
        display: 'table',
        margin: '0 auto',
        width: '300px',
        fontSize: '20px',
        fontFamily: 'monospace',
        fontStyle: 'normal',
        color: 'black',
        backgroundColor: 'rgba(255,255,255,0.9)',
        border: 'none',
        borderTop: '4px solid white',
        height: '22px',
        overflow: 'hidden',
        resize: 'none',
        outlineWidth: '0',
    },

    input_container_style: {
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: '2147483647',
        backgroundColor: 'rgba(0,0,0,0)'
    },
};
