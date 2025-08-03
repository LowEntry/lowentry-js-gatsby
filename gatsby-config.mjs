import fs from 'fs';


export const Plugins = ({precachePages, manifestOptions, googleFonts, workerLibraries, disableOfflineSupport, disablePwaSupport}) => ([
	'gatsby-plugin-sharp',
	'gatsby-transformer-sharp',
	'gatsby-plugin-image',
	'gatsby-plugin-sass',
	'gatsby-plugin-less',
	{
		resolve:'gatsby-plugin-automatic-importer',
		options:{
			'outputName':null,
			'import':    [
				'./src/workers/',
			],
			
			'fileExtensionsCustom':
				(file) =>
				{
					if(file.toLowerCase().endsWith('.worker.js'))
					{
						fs.mkdirSync('./static/workers/', {recursive:true});
						fs.copyFileSync(file, './static/workers/' + file.split('/').pop());
					}
				},
		},
	},
	{
		resolve:'gatsby-plugin-automatic-importer',
		options:{
			'outputName':null,
			'import':    [
				...(workerLibraries ?? []),
			],
			
			'fileExtensionsCustom':
				(file) =>
				{
					fs.mkdirSync('./static/workers/libs/', {recursive:true});
					fs.copyFileSync(file, './static/workers/libs/' + file.split('/').pop());
				},
		},
	},
	{
		resolve:'gatsby-omni-font-loader',
		options:{
			enableListener:true,
			preconnect:    ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
			web:           [
				{
					name:'Roboto',
					file:'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
				},
				...(googleFonts ?? []),
			],
		},
	},
	...(disablePwaSupport ? [] : [{
		resolve:'gatsby-plugin-manifest',
		options:{
			start_url:'/',
			display:  'standalone',
			icon:     'src/images/logo.png',
			...(manifestOptions ?? {}),
		},
	}]),
	{
		resolve:'gatsby-plugin-robots-txt',
		options:{
			policy:[{userAgent:'*', allow:'/'}],
		},
	},
	'gatsby-plugin-sitemap',
	(disableOfflineSupport ? 'gatsby-plugin-remove-serviceworker' : {
		resolve:'gatsby-plugin-offline',
		options:{
			precachePages:['/*', ...(precachePages ?? [])],
			workboxConfig:{
				runtimeCaching:[
					{
						urlPattern:/^\//,
						handler:   'NetworkFirst',
					},
				],
			},
		},
	}),
]);
