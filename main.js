(function() {

    if (window.baumScriptRefreshId) window.clearInterval(window.baumScriptRefreshId);

    String.prototype.truncate = function(n) {
        var reg  = new RegExp("^.{0," + n + "}[\\S]*", 'g');
        var match = this.match(reg);
        var trimmed = match[0].replace(/\s$/,'');
        if (trimmed.length <= n) return trimmed;
        else if (trimmed.indexOf(" ") === -1) return this.substring(0, n)
        else return this.truncate(--n);
    };

    jQuery.expr[':'].CIeq = function(a, i, m) {
        return (a.textContent || a.innerText || "").toUpperCase() === m[3].toUpperCase();
    };

    var featureWindow = null;
    var featureDoc = null;
    var PNaughtyfy = null;
    var featureHes = null;
    var featureRefreshFeatureList = null;
    var baumImage = null;
    var isFormConfirm = true;
    var sessionCounter = 0;

    var initGlobals = function() {

        try {

            featureWindow = document.getElementById("ContentIframe").contentWindow;
            featureDoc = featureWindow.document;
            PNaughtyfy = featureWindow.PNotify;
            featureHes = featureWindow.hes;
            featureRefreshFeatureList = featureWindow.RefreshFeatureList;

            return true;
        }
        catch (error) {
            return false;
        }
    };

    var overridePNotify = function() {

        PNaughtyfy.prototype.parseOptions = function(options, moreOptions) {
            PNaughtyfy.prototype.options = $.extend(true, {}, PNaughtyfy.prototype.options);
            PNaughtyfy.prototype.options.stack = PNaughtyfy.prototype.options.stack;
            var optArray = [options, moreOptions],
                curOpts;
            for (var curIndex in optArray) {
                curOpts = optArray[curIndex];
                if (typeof curOpts == "undefined")
                    break;
                if (typeof curOpts !== 'object') {
                    PNaughtyfy.prototype.options.text = curOpts;
                } else {
                    for (var option in curOpts) {
                        if (PNaughtyfy.prototype.modules[option]) {
                            $.extend(true, PNaughtyfy.prototype.options[option], curOpts[option]);
                        } else {
                            PNaughtyfy.prototype.options[option] = curOpts[option];
                        }
                    }
                }
            }
        };
    };

    var setupForms = function(toggle, myself) {

        if (toggle) isFormConfirm = !isFormConfirm;

        featureHes.form({
            successFunction: featureRefreshFeatureList,
            useAjax: 1,
            formClass: "deleteForm",
            title: "Deletion Confirmation",
            width: 500,
            height: 250,
            isModal: 1,
            yesText: "Yes",
            position: "",
            noText: "No",
            isConfirm: isFormConfirm,
            message: "Are you sure you want to delete the \".Code\" Room Feature ? If you delete this Room Feature, any Room, that has this Room Feature assigned will lose it, this applies to all the hotels in your chain." +
                "<br/><br/>Urchitoochies..<br/><br/><div onclick=\"reSetupForms(true);\">Click here to not show confirmation for future deletes</div>",
            url: ""
        });

        if (toggle) new PNaughtyfy({
            title: "Urchis!",
            text: "Future delete confirmations " + (isFormConfirm ? "enabled!" : "disabled!"),
            styling: "jqueryui",
            delay: 4500
        });

        if (myself) featureWindow.reSetupForms = myself; // add itself to window
    };

    var updateUI = function() {

        if ($("#MenuRow .frstLvl ul #removeConfirmations").length === 0) {

            $("#MenuRow .frstLvl ul")
                .first()
                .append("<li><a id='removeConfirmations'>Toggle Confirmations</a></li>")
                .find("#removeConfirmations")
                .click(function() {
                    featureWindow.reSetupForms(true);
                });
        }

        if ($("#MenuRow .frstLvl ul #clearNaughtyfies").length === 0) {

            $("#MenuRow .frstLvl ul")
                .first()
                .append("<li><a id='clearNaughtyfies'>Clear Naughties</a></li>")
                .find("#clearNaughtyfies")
                .click(function() {
                    PNaughtyfy.removeAll();
                    /*getAllCommissionPolicies().then(data => {
                        console.log(data);
                        postNewCommissionPolicy("TestKTB11", 11).then(console.log("Posted"));
                    });*/
                    processNewRates();
                });
        }

        if ($(featureDoc).find("#RoomAssignmentContainer_ArticleSection").parent().find("#articleBaum").length === 0) {

            baumImage = $(featureDoc)
                .find("#RoomAssignmentContainer_ArticleSection")
                .parent()
                .append("<article id='articleBaum' class='FormBox'><h3>Bb-bbb-ee-eee!</h3><img src='http://kyryll.com/baumscript.png' style='display: none;'></article>")
                .ready()
                .find("img")
                .css({
                    "width": "0",
                    "margin-left": "50%",
                    "margin-top": "50px"
                })
                .show()
                .animate({
                    "width": "100%",
                    "margin-left": "0",
                    "margin-top": "0"
                }, 5000);
        }

        if ($(featureDoc).find("#RoomFeature_ArticleSection #featureList").length === 0) {

            $(featureDoc)
                .find("#RoomFeature_ArticleSection")
                .append("<div class='column'><label for='featureList'>Copy and Paste the list of features below:</label></div><textarea id='featureList' style='margin: 0px 0px 15px -5px; height: 420px; max-width: none;'></textarea>")
                .append("<div style='width: 100%; height: 40px;'><input type='button' id='featureUrchis' value='Urchis!' style='float: right;' /></div>")
                .find("#featureUrchis")
                .click(urchisClickHandler);
        }

        if ($(featureDoc).find("section#ContentArea>header#PageToolbar ul#PageActions #bulkRateUploadButton").length === 0) {

            $(featureDoc)
                .find("section#ContentArea>header#PageToolbar ul#PageActions")
                .prepend("<li><a href='javascript:' id='bulkRateUploadButton' title='Upload rates in bulk' style='background-image: url(http://kyryll.com/baumface.png); background-size: 27px 35px;'><span>Bulk Upload Rates</span></a></li>")
                .find("#bulkRateUploadButton")
                .click(() => {

                    var bulkRateList = $(featureDoc).find("section#ContentArea>#PageContent>.container>.row>.thirteen #bulkRateListContainer");

                    if (bulkRateList.length === 0) {

                        $(featureDoc)
                            .find("section#ContentArea>#PageContent>.container>.row>.thirteen")
                            .prepend("<div id='bulkRateListContainer'><textarea id='bulkRateList' style='margin: 0px 0px 15px; height: 230px; max-width: 100% !important; white-space: nowrap; overflow: auto;'></textarea><input type='button' value='Urchis!' id='rateUrchis' style='float: right; margin-top: -10px; margin-right: -10px;'></div>")
                            .find("#rateUrchis")
                            .click(processNewRates);

                    } else {
                        bulkRateList.remove();
                    }
                });
        }
    };

    var getAllCommissionPolicies = function() {

        return $.get("https://reservations.synxis.com/HMS/Policy/GetCommissionItems?_search=false&rows=100&page=1&sidx=Code&sord=asc")
            .pipe(function(data) {
                return data.rows.map(function(row) {
                    return {
                        id: row.id,
                        code: row.cell[3],
                        percentage: row.cell[5]
                    };
                });
            });
    };

    var postNewCommissionPolicy = function(code, percentage) {

        var deferred = $.Deferred();

        var params = {
            "save-continue": "SaveUpdateSubmit",
            "PageNavigationId": 202331,
            "UniqueID": "00000000-0000-0000-0000-000000000000",
            "ModelViewAction": "Add",
            "IsRateDefaultPolicy": "False",
            "HasRateSeasonsAssigned": "False",
            "IsReadyOnlyLevel": "False",
            "IsDefault": "false",
            "Level": "1",
            "Code": code,
            "PolicyName": percentage + " Percent Commission Policy",
            "Percentage": percentage
        }

        var idSplitter = xhr => {
            var slices = xhr.getResponseHeader("Location").split("/");
            return slices[slices.length - 1];
        };

        $.post("https://reservations.synxis.com/HMS/Policy/CommissionCreate", params)
            .then((data, status, xhr) => {
                deferred.resolve(idSplitter(xhr));
            }).error(xhr => {
                deferred.resolve(idSplitter(xhr));
            });

        return deferred.promise();
    };

    var getCommissionPolicyPercentageFromCode = function(code) {
        var nums = code.match(/\d+/g).map(Number);
        return (nums && nums.length) ? nums[nums.length - 1] : 0;
    };

    var getExistingOrCreateNewCommissionPolicy = function(code, percentage) {

        var deferred = $.Deferred();

        if (code) {

            var finder = item => item.code === code && item.percentage === percentage;

            var policy = featureWindow && featureWindow.commissionPolicyCache && featureWindow.commissionPolicyCache.find(finder);

            if (policy) {
                deferred.resolve(policy);
            } else {
                getAllCommissionPolicies().then(policies => {

                    featureWindow.commissionPolicyCache = policies || [];
                    var found = policies.find(finder);

                    if (found) {
                        deferred.resolve(found);
                    } else {
                        postNewCommissionPolicy(code, percentage).always(id => { // always due to jQuery < 1.8
                            var newPolicy = {
                                id: id,
                                code: code,
                                percentage: percentage
                            };
                            featureWindow.commissionPolicyCache.push(newPolicy);
                            deferred.resolve(newPolicy);
                        });
                    }
                });
            }
        } else {
            deferred.resolve(null);
        }

        return deferred.promise();
    };

    var getAllRoomTypes = function() {

        if (featureWindow.roomTypeCache && featureWindow.roomTypeCache.length) {
            return $.when(featureWindow.roomTypeCache);
        }

        return $.get("https://reservations.synxis.com/HMS/Room/GetRoomTypeItems")
            .pipe(function(data) {
                featureWindow.roomTypeCache = data.rows.map(function(row) {
                    return {
                        id: row.id,
                        category: row.cell[1],
                        code: row.cell[2],
                        name: row.cell[3]
                    };
                });
                return featureWindow.roomTypeCache;
            });
    };

    var checkExtendSession = function() {
        if (sessionCounter++ % 40 === 0) {
            return $.get("https://reservations.synxis.com/CC/SessionExpirationRefreshHandler.ashx?d=" + new Date().getTime());
        }
    };

    var processNewRates = function() {

        var rows = $(featureDoc).find("#bulkRateList").val().split("\n");
        var successes = [];
        var failures = [];
        var notFounds = [];

        var rateFields = {
            fullName: {
                name: "Rate Name", index: null
            },
            nameSuffix: {
                name: "Rate Type", index: null
            },
            code: {
                name: "RAC", index: null
            },
            isCommissioned: {
                name: "Commissionable or  Non-Commissionable", index: null
            },
            commissionAmount: {
                name: "% of commission", index: null
            },
            isTaxInclusive: {
                name: "Tax Inclusive", index: null
            },
            roomTypesRepeatStart: {
                name: "Room Type / Price", index: null
            }
        };

        var suffixToCodeSuffixMap = {
            daily: {
                name: "Daily", codeSuffix: ""
            },
            weekly: {
                name: "Weekly", codeSuffix: "W"
            },
            monthly: {
                name: "Monthly", codeSuffix: "M"
            }
        };

        var mapColsToIndexes = (fields, headerRow) => {
            for (var key in fields) {
                if (fields.hasOwnProperty(key)) {
                    fields[key].index = headerRow.split("\t").indexOf(fields[key].name);
                }
            }
        };

        var mapSuffixToCodeSuffix = (suffix, mapping) => {

            switch (suffix) {

                case mapping.daily.name:
                    return mapping.daily.codeSuffix;

                case mapping.weekly.name:
                    return mapping.weekly.codeSuffix;

                case mapping.monthly.name:
                    return mapping.monthly.codeSuffix;

                default:
                    return "?";
            }
        };

        var getListOfRoomTypesForRate = (fields, cells) => {
            var roomTypeNames = [];
            for (var i = fields.roomTypesRepeatStart.index; !!cells[i]; i += 2) {
                roomTypeNames.push(cells[i]);
            }
            return roomTypeNames;
        };

        var mapListOfRoomTypeNamesToListOfRoomTypeIds = function(roomTypeNames, roomTypes) {
            return roomTypeNames.map(roomTypeName => roomTypes.filter(roomType => roomType.name === roomTypeName)[0].id);
        };

        mapColsToIndexes(rateFields, rows[0]);
        rows = rows.slice(1);

        // check that all fields have been mapped

        var mainNotice = new PNaughtyfy({
            type: "info",
            title: "Urchis!",
            text: rows.length + " entries are being processed..",
            styling: "jqueryui",
            hide: false
        });

        setTimeout(function() {

            $.each(rows, function(row) {

                setTimeout(function() {

                    var cells = rows[row].split("\t");

                    var fullName = cells[rateFields.fullName.index];
                    var nameSuffix = cells[rateFields.nameSuffix.index];
                    var code = cells[rateFields.code.index];
                    var isCommissioned = cells[rateFields.isCommissioned.index] === "Commissionable";
                    var commissionAmount = cells[rateFields.commissionAmount.index];
                    var isTaxInclusive = cells[rateFields.isTaxInclusive.index] === "Yes";
                    var roomTypeNames = getListOfRoomTypesForRate(rateFields, cells);

                    code += mapSuffixToCodeSuffix(nameSuffix, suffixToCodeSuffixMap);
                    var commissionPolicyPercentage = isCommissioned ? getCommissionPolicyPercentageFromCode(commissionAmount) : null;
                    var commissionPolicyName = isCommissioned ? "C" + commissionPolicyPercentage : null;

                    getExistingOrCreateNewCommissionPolicy(commissionPolicyName, commissionPolicyPercentage).then(policy => {

                        getAllRoomTypes().then(roomTypes => {

                            var assignedRoomTypes = mapListOfRoomTypeNamesToListOfRoomTypeIds(roomTypeNames, roomTypes);

                            postNewRate(fullName, nameSuffix, code, code, assignedRoomTypes, policy && policy.id, isTaxInclusive);
                        });
                    });
                }, 300 * row); // linearly increased delay for each post
            });
        }, 3500); // initial delay after showing first popup

        $(document).ajaxStop(function() {

            mainNotice.update({
                type: "success",
                title: "Urchis Finished",
                text: "Processing complete!\n\r\n\r" +
                        "Total Features: " + (successes.length + failures.length + notFounds.length) + "\n\r" +
                        "Total Succeeded: " + successes.length + "\n\r" +
                        "Total Failed: " + failures.length + "\n\r" +
                        "Total Not Found: " + notFounds.length + "\n\r\n\r" +
                        "To see detailed log of this run - click the BAUM!"
            });
        });
    };

    var postNewRate = function(fullName, nameSuffix, code, pmsCode, assignedRoomTypes, commissionPolicyId, isTaxInclusive) {

        var shortDescCharLimit = 94;
        var nameCharLimit = 30; //80;

        var longDesc = fullName + " " + nameSuffix;
        var shortDesc = fullName.truncate(shortDescCharLimit - nameSuffix.length - 1) + " " + nameSuffix;
        var name = fullName.truncate(nameCharLimit - nameSuffix.length - 1) + " " + nameSuffix;

        var defaultGUID = "00000000-0000-0000-0000-000000000000";

        var params = $.param({
            "save-continue": "SaveUpdateSubmit",
            "PageNavigationId": "201036",
            "BarApplies": "False",
            "UniqueID": "00000000-0000-0000-0000-000000000000",
            "ModelViewAction": "Add",
            "IsDirty": "False",
            "GlobalDemandProfilesExist": "False",
            "IsMonthlyRate": "False",
            "IsHotelEnabledForMonthlyRate": "False",
            "IsHotelEnabledForBar": "False",
            "IsHotelEnabledForHurdling": "False",
            "IsHotelEnabledForProductAllocation": "False",
            "HasHotelGdsIdsChannels": "True",
            "HasHotelAriChannels": "False",
            "IsHotelEnabledForMultiRatePlan": "False",
            "IsHotelEnabledForRateSpecificCurrency": "False",
            "HasDerivedRates": "False",
            "IsLinkedToAnotherRate": "False",
            "RateSupportsRewardRedemptionAndZeroPrice": "False",
            "CurrencyPrefix": "AUD",
            "CertificateSupportEnabled": "False",
            "UserHasAccessToCroPermissionsSection": "False",
            "UserHasAccessToPrivilegesAssignmentSection": "False",
            "DisplayEmailTemplateAssignments": "True",
            "DisplayMarketSourceAssignments": "True",
            "DisplayDefaultPrice": "True",
            "DisplayRatePricing": "True",
            "IsEnabledForUseWithGroup": "False",
            "IsEligibleToEditGroupMaster": "True",
            "DisplayChannelAssignments": "True",
            "DisplayUpdatePriviligesAssignments": "True",
            "DisplayCroAccessAssignments": "True",
            "DisplayLoyaltyProgramRates": "True",
            "DisplayRateFilterAssignments": "True",
            "DisplayTemplateAssignments": "True",
            "DisplayTravelAgentGroupAvailability": "True",
            "DisplayTaxesAssignmentSection": "False",
            "IsHotelEnabledForBarByStayDate": "False",
            "IsHotelEnabledForLuxuryTax": "False",
            "DisplayCompanyProfileAssignmentSection": "True",
            "DisplayDefaultStayRestrictions": "False",
            "DisplayStaticPackageAssignments": "True",
            "DisplayLoyaltyPoints": "False",
            "IsMandatory": "False",
            "IsPACorFNSRate": "False",
            "LuxuryTaxRate.UniqueID": "00000000-0000-0000-0000-000000000000",
            "LuxuryTaxRate.Name": "",
            "HasAccessToAllowToDesignateRateAsCrsUpdateAndLra": "False",
            "IsCalculatedFromMargin": "False",
            "HotelUsesPerTaxInclusivity": "False",
            "IsActive": "true",
            "CategoryUniqueId": "00000000-0000-0000-0000-000000000000",
            "RateTypeValue": "1", // Negotiated
            "Code": code, // Code
            "DefaultName": name, // Name
            "DefaultShortDescription": shortDesc, // Short Description
            "DefaultLongDescription": longDesc, // Long Description
            "PmsCode": pmsCode, // PMS Code
            "PmsGroupCode": "",
            "RateClassInfoId": "5", // Negotiated
            "CurrencyId": "9", // AUD
            "DefaultCurrencyRateUniqueId": "00000000-0000-0000-0000-000000000000",
            "SpecialInstructions": "",
            "BonusPointsAmount": "",
            "DefaultIncludesTax": isTaxInclusive, // Include Tax
            "IsSuppressed": "false",
            "IsBreakfastIncluded": "false",
            "MealPlanUniqueId": "00000000-0000-0000-0000-000000000000",
            "DoesHurdleApply": "false",
            "YieldAsRateUniqueId": "00000000-0000-0000-0000-000000000000",
            "IsMerchant": "false",
            "IsCommissionable": !!commissionPolicyId, // Commissionable
            "DefaultCommissionPolicyUniqueId": commissionPolicyId || defaultGUID, // Commission Policy
            "IsRedeemable": "false",
            "CredentialsRequired": "false",
            "SecondaryRateAssignmentNotAllowed": "false",
            "SuppressAriUpdate": "false",
            "IsMandatory": "false",
            "IsManagedinCrsOnly": "false",
            "IsGuaranteePolicyManaged": "false",
            "IsCancellationPolicyManaged": "false",
            "IsRateSeasonManaged": "false",
            "IsStayRestrictionsManaged": "false",
            "IsLastRoomAvailable": "false",
            "IsMappedAsNegotiatedRate": "false",
            "OriginalDerivationTypeId": "0",
            "DerivationTypeId": "1",
            "BaseRateUniqueId": "00000000-0000-0000-0000-000000000000",
            "ExcludedBarRates.ContainerId": "ExcludedBarRatesAssignment",
            "ExcludedBarRates.UnSelectedListHeader": "",
            "ExcludedBarRates.SelectedListHeader": "",
            "ExcludedBarRates.PostSelectedList": "",
            "ExcludedBarRates.OnChangeFunction": "",
            "ExcludedBarRates.OriginalPostSelectedValues": "",
            "OffsetCalculationMethodId": "1",
            "DemandProfileDerivationModel.DerivationFactors": "",
            "DemandProfileDerivationModel.DerivedRoundingRules": "",
            "DemandProfileDerivationModel.RoundToWholeAmountOptions": "",
            "DemandProfileDerivationModel.RateUniqueId": "00000000-0000-0000-0000-000000000000",
            "DemandProfileDerivationModel.CurrencyPrefix": "AUD",
            "DemandProfileDerivationModel.Tiers[0].TierIndex": "1",
            "DemandProfileDerivationModel.Tiers[0].PriceAmount": "0",
            "DemandProfileDerivationModel.Tiers[0].FloorPrice": "0",
            "DemandProfileDerivationModel.Tiers[0].CeilingPrice": "0",
            "DefaultPrice": "",
            "SelectedDerivationType": "1",
            "DefaultAdjustmentType": "1",
            "DefaultDerivedFormula": "",
            "DefaultFloorPrice": "",
            "DefaultCeilingPrice": "",
            "DefaultRoundingRule": "0",
            "DefaultRoundToWholeAmount": "0",
            "AutomaticallyCreateSeason": "false",
            "SeasonDateRangePickerModel.MinDate.CalendarID": "6152",
            "SeasonDateRangePickerModel.MaxDate.CalendarID": "7248",
            "SeasonDateRangePickerModel.Type": "Range",
            "SeasonDateRangePickerModel.AllowNoEndDate": "True",
            "SeasonDateRangePickerModel.AllowQuickSelection": "False",
            "SeasonDateRangePickerModel.Direction": "Future",
            "SeasonDateRangePickerModel.AllowDaysOfWeekSelection": "False",
            "SeasonDateRangePickerModel.ShowTime": "False",
            "SeasonDateRangePickerModel.StartDateCalendarId": "6152",
            "SeasonDateRangePickerModel.StartDate": "3/18/2017",
            "SeasonDateRangePickerModel.StartDate.CalendarId": "6152",
            "SeasonDateRangePickerModel.StartDate_Date": "3/18/2017",
            "SeasonDateRangePickerModel.IsMaxEndDate": "false",
            "SeasonDateRangePickerModel.EndDateCalendarId": "6152",
            "SeasonDateRangePickerModel.EndDate": "3/18/2017",
            "SeasonDateRangePickerModel.EndDate.CalendarId": "6152",
            "SeasonDateRangePickerModel.EndDate_Date": "3/18/2017",
            "BaseRate": "",
            "DerivedFormula": "",
            "AdjustmentType": "1",
            "FloorPrice": "",
            "CeilingPrice": "",
            "RoundingRule": "0",
            "RoundToWholeAmountOption": "0",
            "OneAdult": "",
            "TwoAdults": "",
            "ExtraAdult": "",
            "DefaultChild": "",
            "HotelUsesLowestAvailableRate": "False",
            "HasAccessToConfigureLowestAvailableRateCompare": "False",
            "HasAccessToExcludeLowestAvailableRate": "False",

            "AssignedRooms.PostSelectedList": assignedRoomTypes.join(","),
            "ChannelAssignment.AssignmentsSetterForPost": assignedRoomTypes.map(roomType => roomType + " 13") // 13 == checked
        }, true); // makes serialised param arrays not have []

        var deferred = $.Deferred();

        $.post("https://reservations.synxis.com/HMS/Rate/Create?isMonthlyRate=False&isPACorFNSRate=False", params)
            .then(function(data, status, xhr) {
                deferred.resolve(xhr.getResponseHeader("Location"));
            }).error(function(xhr) {
                deferred.resolve(xhr.getResponseHeader("Location"));
            });

        return deferred.promise();
    };

    var urchisClickHandler = function() {

        var rows = $(featureDoc).find("#featureList").val().split("\n");
        var totalFlaggedYes = 0;
        var successes = [];
        var failures = [];
        var notFounds = [];

        var mainNotice = new PNaughtyfy({
            type: "info",
            title: "Urchis!",
            text: rows.length + " entries are being processed..",
            styling: "jqueryui",
            hide: false
        });

        setTimeout(function() {

            $.each(rows, function(row) {

                setTimeout(function() {

                    var cells = rows[row].split("\t");
                    var featureItem = cells[0];
                    var featureFlag = cells[1];
                    var featureComment = cells[2];

                    if (featureFlag.toUpperCase() === "YES") totalFlaggedYes++;

                    console.log("Processing " + featureItem + " Will Post: " + featureFlag, "Total Flagged: " + totalFlaggedYes);

                    mainNotice.update({
                        title: "Urchis In Progress",
                        text: "Processing " + featureItem
                    });

                    if (featureFlag.toUpperCase() === "YES") {

                        $(featureDoc).find("form")[0].reset();

                        var featureListItem = $(featureDoc).find("div.list-scroll ul li:CIeq('" + featureItem + "')");

                        if (featureListItem && featureListItem.length === 1) {

                            featureListItem.click();

                            var featureFormParams = $(featureDoc).find("form").serialize();

                            $.post("https://reservations.synxis.com/HMS/Room/FeatureCreate", featureFormParams).then(function() {

                                console.log(featureItem + " uploaded");

                                successes.push(featureItem);

                                new PNaughtyfy({
                                    title: featureItem,
                                    text: "Uploaded successfully",
                                    hide: true,
                                    delay: 3000,
                                    type: "success",
                                    styling: "jqueryui"
                                });

                            }, function(error) {

                                if (error.status === 401) {

                                    console.log(featureItem + " got Unauthorised (probably all good)");

                                    successes.push(featureItem);

                                    new PNaughtyfy({
                                        title: featureItem,
                                        text: "Uploaded successfully",
                                        hide: true,
                                        delay: 3000,
                                        type: "success",
                                        styling: "jqueryui"
                                    });

                                } else {

                                    console.log(featureItem + " failed - ", error.status, error.statusText);

                                    failures.push(featureItem + " (" + error.statusText + ")");

                                    new PNaughtyfy({
                                        title: featureItem,
                                        text: error.statusText,
                                        hide: true,
                                        delay: 3000,
                                        type: "error",
                                        styling: "jqueryui"
                                    });
                                }
                            });

                        } else {

                            console.log("Could not find - ", featureItem);

                            notFounds.push(featureItem);

                            new PNaughtyfy({
                                title: featureItem,
                                text: "NOT FOUND in the feature list - check spelling?",
                                hide: false,
                                type: "error",
                                styling: "jqueryui"
                            });
                        }
                    }
                }, 300 * row); // linearly increased delay for each post
            });
        }, 3500); // initial delay after showing first popup

        $(baumImage).click(function() {

            var wrapCol = function(heading, text) {
                return "<div style='margin: 5px; float: left;'><span style='font-color: red;'>" + heading + "</span><br/>" + text.join("\n\r") + "</div>";
            };

            var log = (successes.length ? wrapCol("Success:", successes) : "") +
                        (failures.length ? wrapCol("Failure:", failures) : "") +
                        (notFounds.length ? wrapCol("Not Found:", notFounds) : "");

            new PNaughtyfy({
                title: "Last Run Log",
                text: log,
                hide: false,
                type: "info",
                styling: "jqueryui",
                width: "auto",
            });
        });

        $(document).ajaxStop(function() {

            mainNotice.update({
                type: "success",
                title: "Urchis Finished",
                text: "Processing complete!\n\r\n\r" +
                        "Total Features: " + (successes.length + failures.length + notFounds.length) + "\n\r" +
                        "Total Succeeded: " + successes.length + "\n\r" +
                        "Total Failed: " + failures.length + "\n\r" +
                        "Total Not Found: " + notFounds.length + "\n\r\n\r" +
                        "To see detailed log of this run - click the BAUM!"
            });
        });
    };

    window.baumScriptRefreshId = setInterval(function() {
        if (initGlobals()) {
            overridePNotify();
            setupForms(false, setupForms);
            updateUI();
        }
        checkExtendSession();
    }, 2000);

})();