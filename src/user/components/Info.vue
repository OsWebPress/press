<template>
	<div class="bg-green-100 p-2 rounded-lg flex flex-col my-2">
	  <div class="flex items-center">
		<span class="bg-green text-green-500 font-semibold text-base my-auto ml-1.5">Tip:</span>
	  </div>
	  <span class="bg-white/50 p-2 m-0 mt-1 rounded-md text-green-700">
		  <slot></slot>
	  </span>
	</div>
  </template>