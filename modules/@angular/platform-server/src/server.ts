/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {PlatformLocation} from '@angular/common';
import {platformCoreDynamic} from '@angular/compiler';
import {Injectable, NgModule, PLATFORM_INITIALIZER, PlatformRef, Provider, RootRenderer, createPlatformFactory, isDevMode, platformCore} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {ServerPlatformLocation} from './location';
import {Parse5DomAdapter} from './parse5_adapter';
import {DebugDomRootRenderer} from './private_import_core';
import {DomAdapter, SharedStylesHost} from './private_import_platform-browser';
import {ServerRootRenderer} from './server_renderer';


function notSupported(feature: string): Error {
  throw new Error(`platform-server does not support '${feature}'.`);
}

export const INTERNAL_SERVER_PLATFORM_PROVIDERS: Array<any /*Type | Provider | any[]*/> = [
  {provide: PLATFORM_INITIALIZER, useValue: initParse5Adapter, multi: true},
  {provide: PlatformLocation, useClass: ServerPlatformLocation},
];

function initParse5Adapter() {
  Parse5DomAdapter.makeCurrent();
}


export function _createConditionalRootRenderer(rootRenderer: any) {
  if (isDevMode()) {
    return new DebugDomRootRenderer(rootRenderer);
  }
  return rootRenderer;
}

export const SERVER_RENDER_PROVIDERS: Provider[] = [
  ServerRootRenderer,
  {provide: RootRenderer, useFactory: _createConditionalRootRenderer, deps: [ServerRootRenderer]},
  // use plain SharedStylesHost, not the DomSharedStylesHost
  SharedStylesHost
];

/**
 * The ng module for the server.
 *
 * @experimental
 */
@NgModule({exports: [BrowserModule], providers: SERVER_RENDER_PROVIDERS})
export class ServerModule {
}

/**
 * @experimental
 */
export const platformServer =
    createPlatformFactory(platformCore, 'server', INTERNAL_SERVER_PLATFORM_PROVIDERS);

/**
 * The server platform that supports the runtime compiler.
 *
 * @experimental
 */
export const platformDynamicServer =
    createPlatformFactory(platformCoreDynamic, 'serverDynamic', INTERNAL_SERVER_PLATFORM_PROVIDERS);
