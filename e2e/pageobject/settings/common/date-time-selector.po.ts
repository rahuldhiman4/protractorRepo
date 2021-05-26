import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class DateTimeSelector {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        previousMonthSelector: 'button[data-testid*="prevMonth"]',
        invalidData: '.has-danger .form-control-feedback',
        nextMonthSelector: 'button[data-testid*="nextMonth"]',
        monthLabel: '.card-block .a3t-calendar--controls-info div',
        previousYearSelector: 'button[data-testid*="prevYear"]',
        nextYearSelector: 'button[data-testid*="nextYear"]',
        yearLabel: '.card-block .a3t-calendar--controls-info div',
        weekNames: '.a3t-calendar--table-week-name',
        selectedStartDate: '[data-testid*="start"] div',
        selectedEndDate: '[data-testid*="end"] div',
        dateTimeRangeHeader: '.a3t-datetime-range--header button',
        selectTimeToggle: 'button[class*="time-picker"]',
        activeTimeUnit: '[data-testid*="hhmmss"] .a3t-clock--control-item.active',
        hourSelect: '.a3t-clock--tick-label',
        selectedTimeValue: '.a3t-datetime--time-picker-summary-input',
        ampm: 'button[data-testid*="ampm"] .a3t-clock--control-item',
        refreshIcon: 'button[rx-id="refresh-button"]',
        filterPresetBtn: 'button.d-icon-left-filter',
        filterItems: '.advanced-filter__container .advanced-filter__accordion-tab .text-direction span',
        data: '[class="adapt-mt-text"]',
    }

    //Month name should be full month name starting with Caps
    async selectPreviousMonthUsingAngularIcon(monthName: string): Promise<void> {
        for (let i: number = 0; i < 12; i++) {
            if (await $$(this.selectors.monthLabel).get(0).getText() == monthName) 
            break;
            else await $(this.selectors.previousMonthSelector).click();
            await browser.sleep(500);
        }
    }

    //Month name should be full month name starting with Caps
    async selectNextMonthUsingAngularIcon(monthName: string): Promise<void> {
        for (let i: number = 0; i < 12; i++) {
            if (await $$(this.selectors.monthLabel).get(0).getText() == monthName) break;
            else await $(this.selectors.nextMonthSelector).click();
        }
    }

    async selectDateOnCalender(day: number): Promise<void> {
           await $(`.a3t-calendar--table-day[aria-hidden="false"] button[data-testid*="day_${day.toString()}"]`).click();
    }

    async selectPreviousYearUsingAngularIcon(yearName: number): Promise<void> {
        for (let i: number = 0; i < 15; i++) {
            if (await $$(this.selectors.yearLabel).get(1).getText() == yearName.toString()) break;
            else await $(this.selectors.previousYearSelector).click();
            await browser.sleep(1000);
        }
    }

    async selectNextYearUsingAngularIcon(yearName: number): Promise<void> {
        for (let i: number = 0; i < 12; i++) {
            if (await $$(this.selectors.yearLabel).get(1).getText() == yearName.toString()) break;
            else await $(this.selectors.nextYearSelector).click();
            await browser.sleep(1000);
        }
    }

    async isAllDaysPresentInWeek(): Promise<boolean> {
        let actualWeekDays = await element.all(by.css(this.selectors.weekNames))
            .map(async function (header) {
                return (await header.getAttribute('innerText')).trim();
            });
        let expectedWeekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        return actualWeekDays.length === expectedWeekDays.length && actualWeekDays.every(
            (value, index) => (value === expectedWeekDays[index])
        );
    }
    
    async clickEndDateTab(): Promise<void> {
        await $(this.selectors.selectedEndDate).click();
    }

    async clickStartDateTab(): Promise<void> {
        await $(this.selectors.selectedStartDate).click();
    }

    async getSelectedStartDateTimestamp(): Promise<string> {
        return await $(this.selectors.selectedStartDate).getText();
    }

    async getSelectedEndDateTimestamp(): Promise<string> {
        return await $(this.selectors.selectedEndDate).getText();
    }

    async getMonthFromCaleder(): Promise<string> {
        return await $$(this.selectors.monthLabel).get(0).getText();
    }
    async getYearFromCaleder(): Promise<string> {
        return await $$(this.selectors.yearLabel).get(1).getText();
    }

    async selectTimeToggle(): Promise<void> {
        await $(this.selectors.selectTimeToggle).click();
    }

    //Return HH || MM while they are Active
    async getActiveTimeUnit(): Promise<string> {
        return await $(this.selectors.activeTimeUnit).getText();
    }

    async setHour(hours: string): Promise<void> {
        let getHours;
        for (let a = 1; a <= 12; a++) {
            getHours = await $$(this.selectors.selectedTimeValue).get(0).getAttribute("aria-valuenow");
            if (getHours == hours) {
                break;
            } else {
                await $$(this.selectors.selectedTimeValue).get(0).click();
                await $$(this.selectors.selectedTimeValue).get(0).sendKeys(protractor.Key.ARROW_DOWN);
            }
        }
    }

    async setMinute(minute: string): Promise<void> {
        await $$(this.selectors.selectedTimeValue).get(1).sendKeys(minute);
    }

    //AM or PM
    async clickMeridianValue(AMorPM: string): Promise<void> {
        let amPm = await $$(this.selectors.selectedTimeValue).get(2).getAttribute("aria-valuenow");
        if (!amPm.match(AMorPM)) {
            await $$(this.selectors.selectedTimeValue).get(2).click();
        }
    }

    async getSelectedTimeValue(unit: string): Promise<string> {
        let timeValue: string = undefined;
        switch (unit) {
            case "Hour": {
                timeValue = await $$(this.selectors.selectedTimeValue).get(0).getText();
                break;
            }
            case "Minute": {
                timeValue = await $$(this.selectors.selectedTimeValue).get(1).getText();
                break;
            }
            case "Meridiam Time": {
                timeValue = await $$(this.selectors.selectedTimeValue).get(2).getText();
                break;
            }
            default: {
                timeValue = await $$(this.selectors.selectedTimeValue).get(0).getText();
                break;
            }
        }
        return timeValue;
    }
}

export default new DateTimeSelector();