import { Page, Locator, Frame, FrameLocator } from '@playwright/test';
import { ElementInfo } from '../supports/element.info';
import { LocatorManager } from '../supports/locator.manager';
import * as path from 'path';

/**
 * Helper class for interacting with page elements.
 */
export class WebInteractionHelper extends LocatorManager {
    private static readonly logger = console;
    private static readonly DEFAULT_TIMEOUT = 30000;
    protected static page: Page;

    /**
     * Creates a new WebInteractionHelper instance and initializes all pages and locators.
     * @param page Playwright Page instance
     */
    constructor(page: Page) {
        super();
        WebInteractionHelper.page = page;
        LocatorManager.initializeAllPages(page);
    }

    /**
     * Gets the Playwright Locator object for this element after waiting for it to be in a specific state.
     * @param element Element name to retrieve locator for.
     * @param state State to wait for (visible, hidden, attached, detached).
     * @param timeout Wait timeout in milliseconds.
     * @returns Playwright Locator object.
     */
    protected getLocator(element: string, state: 'visible' | 'hidden' | 'attached' | 'detached', timeout: number): Locator {
        const elementInfo = new ElementInfo(element);
        WebInteractionHelper.logger.debug(`Getting locator for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);

        try {
            const locator = elementInfo.getLocator();
            locator.waitFor({ state, timeout });
            locator.scrollIntoViewIfNeeded();
            return locator;
        } catch (e) {
            WebInteractionHelper.logger.error(`Timeout waiting for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} to be in state: ${state}`);
            throw new Error(`Timeout waiting for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} to be in state: ${state}`);
        }
    }

    /**
     * Gets the Playwright Locator object for this element with default wait and scroll into view.
     * @param element Element name to retrieve locator for.
     * @returns Playwright Locator object.
     */
    protected getElementLocator(element: string): Locator {
        return this.getLocator(element, 'visible', WebInteractionHelper.DEFAULT_TIMEOUT);
    }

    /**
     * Waits for an element to be visible on the page.
     * @param element Element to wait for
     * @param timeout Wait timeout in milliseconds
     */
    public waitForElement(element: string, timeout: number = WebInteractionHelper.DEFAULT_TIMEOUT): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Waiting for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getLocator(element, 'visible', timeout);
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to wait for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to wait for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Clicks on the specified element.
     * @param element Element to click on
     * @param timeout Wait timeout in milliseconds
     */
    public click(element: string, timeout: number = WebInteractionHelper.DEFAULT_TIMEOUT): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Clicking on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getLocator(element, 'visible', timeout).click();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to click on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to click on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Clears the text in an input field.
     * @param element Element to clear text from
     */
    public clear(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Clearing text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).clear();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to clear text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to clear text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Focuses on the specified element.
     * @param element Element to focus on
     */
    public focus(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Focusing on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).focus();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to focus on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to focus on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Hovers over the specified element.
     * @param element Element to hover over
     */
    public hover(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Hovering over element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).hover();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to hover over element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to hover over element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Verifies if an element is enabled.
     * @param element Element to check
     * @returns true if the element is enabled, false otherwise
     */
    public isEnabled(element: string): Promise<boolean> {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking if element is enabled: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            return this.getElementLocator(element).isEnabled();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to check if element is enabled: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Verifies if an element is checked (for checkboxes and radio buttons).
     * @param element Element to check
     * @returns true if the element is checked, false otherwise
     */
    public isChecked(element: string): boolean {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking if element is checked: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            return this.getElementLocator(element).isChecked();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to check if element is checked: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            return false;
        }
    }

    /**
     * Scrolls to the specified element.
     * @param element Element to scroll to
     */
    public scrollToElement(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Scrolling to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).scrollIntoViewIfNeeded();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to scroll to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to scroll to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Checks a checkbox or radio button.
     * @param element Element to check
     */
    public check(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).check();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to check element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to check element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Unchecks a checkbox or radio button.
     * @param element Element to uncheck
     */
    public uncheck(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Unchecking element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).uncheck();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to uncheck element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to uncheck element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Toggles a checkbox or radio button.
     * @param element Element to toggle
     */
    public toggle(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Toggling element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            const locator = this.getElementLocator(element);
            if (await locator.isChecked()) {
                await locator.uncheck();
            } else {
                await locator.check();
            }
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to toggle element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to toggle element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Verifies if an element is visible on the page.
     * @param element Element to verify visibility for
     * @returns true if visible, false otherwise
     */
    public isVisible(element: string): boolean {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking visibility of element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            return this.getElementLocator(element).isVisible();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to check visibility of element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            return false;
        }
    }

    /**
     * Selects an option from a dropdown by visible text.
     * @param element Element to select option from
     * @param option Option to select (text)
     */
    public selectByText(element: string, option: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Selecting option: ${option} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).selectOption({ label: option });
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to select option: ${option} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to select option: ${option} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Selects an option from a dropdown by value.
     * @param element Element to select option from
     * @param value Value to select
     */
    public selectByValue(element: string, value: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Selecting value: ${value} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).selectOption({ value });
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to select value: ${value} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to select value: ${value} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Selects an option from a dropdown by index.
     * @param element Element to select option from
     * @param index Index to select
     */
    public selectByIndex(element: string, index: number): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Selecting index: ${index} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).selectOption({ index });
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to select index: ${index} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to select index: ${index} from dropdown: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Double clicks on the specified element.
     * @param element Element to double click on
     */
    public doubleClick(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Double clicking on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).dblclick();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to double click on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to double click on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Right clicks on the specified element.
     * @param element Element to right click on
     */
    public rightClick(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Right clicking on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).click({ button: 'right' });
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to right click on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to right click on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Types text into the specified element.
     * @param element Element to type text into
     * @param text Text to type
     */
    public type(element: string, text: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Typing text: ${text} into element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).fill(text);
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to type text into element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to type text into element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Gets the text content of the specified element.
     * @param element Element to get text from
     * @returns Text content of the element
     */
    public getText(element: string): string {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            return this.getElementLocator(element).textContent() || '';
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to get text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to get text from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Gets the value of the specified attribute of the element.
     * @param element Element to get attribute from
     * @param attribute Attribute name
     * @returns Attribute value
     */
    public getAttribute(element: string, attribute: string): string | null {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting attribute: ${attribute} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            return this.getElementLocator(element).getAttribute(attribute);
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to get attribute: ${attribute} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to get attribute: ${attribute} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Gets the value of the specified CSS property of the element.
     * @param element Element to get CSS value from
     * @param cssProperty CSS property name
     * @returns CSS property value
     */
    public getCssValue(element: string, cssProperty: string): string {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting CSS property: ${cssProperty} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            return this.getElementLocator(element).evaluate((el, prop) =>
                window.getComputedStyle(el).getPropertyValue(prop), cssProperty) as string;
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to get CSS property: ${cssProperty} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to get CSS property: ${cssProperty} from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Drags an element and drops it onto another element.
     * @param sourceElement Element to drag
     * @param targetElement Element to drop onto
     */
    public dragAndDrop(sourceElement: string, targetElement: string): void {
        const sourceElementInfo = new ElementInfo(sourceElement);
        const targetElementInfo = new ElementInfo(targetElement);
        try {
            WebInteractionHelper.logger.debug(`Dragging element: ${sourceElementInfo.getElementName()} and dropping onto element: ${targetElementInfo.getElementName()}`);
            this.getElementLocator(sourceElement).dragTo(this.getElementLocator(targetElement));
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to drag and drop element: ${sourceElementInfo.getElementName()} onto element: ${targetElementInfo.getElementName()} - ${(e as Error).message}`);
            throw new Error(`Failed to drag and drop element: ${sourceElementInfo.getElementName()} onto element: ${targetElementInfo.getElementName()}`);
        }
    }

    /**
     * Uploads a file to the specified file input element.
     * @param element Element to upload file to
     * @param filePath Path to the file to upload
     */
    public uploadFile(element: string, filePath: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Uploading file: ${filePath} to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).setInputFiles(path.resolve(filePath));
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to upload file: ${filePath} to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to upload file: ${filePath} to element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Clears the file input element.
     * @param element Element to clear file input from
     */
    public clearFileInput(element: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Clearing file input for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).setInputFiles([]);
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to clear file input for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to clear file input for element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Gets the count of elements matching the locator.
     * @param element Element to count
     * @returns Number of elements matching the locator
     */
    public getElementCount(element: string): number {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting count of elements: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            return this.getElementLocator(element).count();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to get count of elements: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to get count of elements: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Simulates the press of a key or combination of keys.
     * @param element Element to focus on before pressing the key (can be null to press on the page)
     * @param keys Key or combination of keys to press (e.g., "Control+A", "Shift+Tab", "Enter")
     */
    public pressKey(element: string | null, keys: string): void {
        try {
            if (element) {
                const elementInfo = new ElementInfo(element);
                WebInteractionHelper.logger.debug(`Pressing key(s): ${keys} on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
                this.getElementLocator(element).focus();
            } else {
                WebInteractionHelper.logger.debug(`Pressing key(s): ${keys} on the page`);
            }
            WebInteractionHelper.page.keyboard.press(keys);
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to press key(s): ${keys} - ${(e as Error).message}`);
            throw new Error(`Failed to press key(s): ${keys}`);
        }
    }

    /**
     * Switches to a frame using its locator.
     * @param frameLocator Locator of the frame to switch to
     * @returns FrameLocator object
     */
    public switchToFrame(frameLocator: string): FrameLocator {
        try {
            WebInteractionHelper.logger.debug(`Switching to frame: ${frameLocator}`);
            const frame = WebInteractionHelper.page.frameLocator(frameLocator);
            if (!frame) {
                throw new Error(`Frame not found: ${frameLocator}`);
            }
            return frame;
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to switch to frame: ${frameLocator} - ${(e as Error).message}`);
            throw new Error(`Failed to switch to frame: ${frameLocator}`);
        }
    }

    /**
     * Switches to a frame by its name or URL and returns it.
     * @param frameNameOrUrl Name or URL of the frame to switch to
     * @returns Frame object
     */
    public switchToFrameByNameOrUrl(frameNameOrUrl: string): Frame {
        try {
            WebInteractionHelper.logger.debug(`Switching to frame by name or URL: ${frameNameOrUrl}`);
            const frame = WebInteractionHelper.page.frame(frameNameOrUrl);
            if (!frame) {
                throw new Error(`Frame not found: ${frameNameOrUrl}`);
            }
            return frame;
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to switch to frame by name or URL: ${frameNameOrUrl} - ${(e as Error).message}`);
            throw new Error(`Failed to switch to frame by name or URL: ${frameNameOrUrl}`);
        }
    }

    /**
     * Switches back to the main page from a frame.
     */
    public switchToMainPage(): void {
        try {
            WebInteractionHelper.logger.debug('Switching back to the main page');
            WebInteractionHelper.page.mainFrame();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to switch back to the main page - ${(e as Error).message}`);
            throw new Error('Failed to switch back to the main page');
        }
    }

    /**
     * Returns a list of all open tabs (pages).
     * @returns List of Page objects representing open tabs
     */
    public getAllTabs(): Page[] {
        try {
            WebInteractionHelper.logger.debug('Getting all open tabs');
            return WebInteractionHelper.page.context().pages();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to get all open tabs - ${(e as Error).message}`);
            throw new Error('Failed to get all open tabs');
        }
    }

    /**
     * Switches to a specific tab by its index.
     * @param index Index of the tab to switch to (starting from 0)
     */
    public switchToTab(index: number): void {
        try {
            WebInteractionHelper.logger.debug(`Switching to tab at index: ${index}`);
            const tabs = WebInteractionHelper.page.context().pages();
            if (index >= tabs.length) {
                throw new Error(`Tab index out of bounds: ${index}`);
            }
            WebInteractionHelper.page = tabs[index];
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to switch to tab at index: ${index} - ${(e as Error).message}`);
            throw new Error(`Failed to switch to tab at index: ${index}`);
        }
    }

    /**
     * Switches to a tab by its title.
     * @param title Title of the tab to switch to
     */
    public switchToTabByTitle(title: string): void {
        try {
            WebInteractionHelper.logger.debug(`Switching to tab with title: ${title}`);
            const tabs = WebInteractionHelper.page.context().pages();
            for (const tab of tabs) {
                if (title === tab.title()) {
                    WebInteractionHelper.page = tab;
                    return;
                }
            }
            throw new Error(`No tab found with title: ${title}`);
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to switch to tab with title: ${title} - ${(e as Error).message}`);
            throw new Error(`Failed to switch to tab with title: ${title}`);
        }
    }

    /**
     * Returns a list of all open windows (pages).
     * @returns List of Page objects representing open windows
     */
    public getAllWindows(): Page[] {
        try {
            WebInteractionHelper.logger.debug('Getting all open windows');
            return WebInteractionHelper.page.context().pages();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to get all open windows - ${(e as Error).message}`);
            throw new Error('Failed to get all open windows');
        }
    }

    /**
     * Switches to a specific window by its index.
     * @param index Index of the window to switch to (starting from 0)
     */
    public switchToWindow(index: number): void {
        try {
            WebInteractionHelper.logger.debug(`Switching to window at index: ${index}`);
            const windows = WebInteractionHelper.page.context().pages();
            if (index >= windows.length) {
                throw new Error(`Window index out of bounds: ${index}`);
            }
            WebInteractionHelper.page = windows[index];
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to switch to window at index: ${index} - ${(e as Error).message}`);
            throw new Error(`Failed to switch to window at index: ${index}`);
        }
    }

    /**
     * Switches to a window by its URL.
     * @param url URL of the window to switch to
     */
    public switchToWindowByUrl(url: string): void {
        try {
            WebInteractionHelper.logger.debug(`Switching to window with URL: ${url}`);
            const windows = WebInteractionHelper.page.context().pages();
            for (const window of windows) {
                if (url === window.url()) {
                    WebInteractionHelper.page = window;
                    return;
                }
            }
            throw new Error(`No window found with URL: ${url}`);
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to switch to window with URL: ${url} - ${(e as Error).message}`);
            throw new Error(`Failed to switch to window with URL: ${url}`);
        }
    }

    /**
     * Checks if an element has a specific attribute.
     * @param element Element to check
     * @param attribute Attribute name
     * @returns true if the attribute exists, false otherwise
     */
    public hasAttribute(element: string, attribute: string): boolean {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking if element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} has attribute: ${attribute}`);
            return this.getElementLocator(element).getAttribute(attribute) !== null;
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to check attribute: ${attribute} on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            return false;
        }
    }

    /**
     * Checks if an element has a specific class.
     * @param element Element to check
     * @param className Class name to check
     * @returns true if the class exists, false otherwise
     */
    public hasClass(element: string, className: string): boolean {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Checking if element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} has class: ${className}`);
            const classAttribute = this.getElementLocator(element).getAttribute('class');
            return classAttribute ? classAttribute.includes(className) : false;
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to check class: ${className} on element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            return false;
        }
    }

    /**
     * Types a value into a currency field.
     * @param element Element to type into
     * @param value Value to type
     */
    public typeCurrencyField(element: string, value: string): void {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Typing currency value: ${value} into element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            this.getElementLocator(element).fill(value);
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to type currency value into element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to type currency value into element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }

    /**
     * Retrieves all text contents of elements matching a locator.
     * @param locator Locator of the elements
     * @returns List of text contents
     */
    public getAllTextContents(locator: string): string[] {
        try {
            WebInteractionHelper.logger.debug(`Getting all text contents for locator: ${locator}`);
            return WebInteractionHelper.page.locator(locator).allTextContents();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to get all text contents for locator: ${locator} - ${(e as Error).message}`);
            throw new Error(`Failed to get all text contents for locator: ${locator}`);
        }
    }

    /**
     * Retrieves the value of an input field.
     * @param element Element to get value from
     * @returns Value of the input field
     */
    public getInputValue(element: string): string {
        const elementInfo = new ElementInfo(element);
        try {
            WebInteractionHelper.logger.debug(`Getting value from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
            return this.getElementLocator(element).inputValue();
        } catch (e) {
            WebInteractionHelper.logger.error(`Failed to get value from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()} - ${(e as Error).message}`);
            throw new Error(`Failed to get value from element: ${elementInfo.getElementName()} in page: ${elementInfo.getPageName()}`);
        }
    }
}
