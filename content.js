// Detect the current site
const currentUrl = window.location.href;
let site = "";

if (currentUrl.includes('lu.ma')) {
    site = 'lu.ma';
} else if (currentUrl.includes('meetup.com')) {
    site = 'meetup.com';
} else if (currentUrl.includes('eventbrite.ca')) {
    site = 'eventbrite.ca';
} else if (currentUrl.includes('allevents.in')) {
    site = 'allevents.in';
} else {
    site = 'unknown';
}
function Extract(text) {
    // Keep the text before the colon (if present) and remove other symbols
    let filteredText = text.split(':')[0];  // Split at the first colon and take the part before it

    return filteredText
        .replace(/[^\w\s]/g, '')  // Remove all non-word characters (except spaces)
        .split(':')[0].replace(/[^\w\s]/g, '').trim()
        .split(' ')  // Split by spaces
        .filter(word => word.trim() !== '')  // Filter out empty strings
        .join('');  // Join the words into a single string without spaces
}

// Create the button
let button = document.createElement('button');
button.innerText = "Meet other attendees at Popin's!";
button.className = "popin_button";

// Add button styles
button.style.backgroundColor = "#FF4500";  // Change the background color
button.style.color = "#fff";  // Keep the text color white
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";
button.style.height = "auto";
button.style.width = "100%";
button.style.padding = "24px 20px 20px 20px";
button.style.whiteSpace = "normal";

// Create a div to wrap the button
let buttonContainer = document.createElement('div');
buttonContainer.className = "button_container";
buttonContainer.appendChild(button);
buttonContainer.style.padding = "10px 0";

// Function to embed the button in the correct container based on the site
function embedButton(site) {
    let container;

    switch (site) {
        case 'lu.ma':
            // Listen for global click events
            document.addEventListener('click', async (event) => {
                console.log(event.target.tagName);
                // Locate the container where the button will be inserted
                const elements = document.querySelectorAll('div.lux-modal-body.overflow-auto');
                container = Array.from(elements).find(el => el.className === 'lux-modal-body overflow-auto');
                if (container) {
                    // Insert the button container at the top of the found container
                    container.insertBefore(buttonContainer, container.firstChild);
                    //console.log("Button container added to container:", container);
                };
            });
            break;

        case 'eventbrite.ca':
            // Create a MutationObserver to monitor new nodes added to the document
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log("Mutation detected:", mutation);
                    mutation.addedNodes.forEach((node) => {
                        console.log("Added node:", node);
                        if (node.tagName === 'IFRAME') {
                            console.log("New iframe added:", node);

                            // Wait for the iframe to load
                            node.addEventListener('load', () => {
                                //console.log("Iframe loaded:", node);

                                try {
                                    // Ensure we can access the iframe's document object
                                    const iframeDocument = node.contentDocument || node.contentWindow.document;
                                    //console.log("Accessed iframe document:", iframeDocument);

                                    // Start monitoring content changes within the iframe
                                    const iframeObserver = new MutationObserver((iframeMutations) => {
                                        iframeMutations.forEach((iframeMutation) => {
                                            console.log("Iframe mutation detected:", iframeMutation);
                                            iframeMutation.addedNodes.forEach((iframeNode) => {
                                                console.log("Added node in iframe:", iframeNode);
                                                if (iframeNode.nodeType === Node.ELEMENT_NODE) {
                                                    // Check if the node is the target section
                                                    if (iframeNode.matches('section.related-events.g-grid.g-grid--page-margin-manual')) {
                                                        //console.log("Target section found:", iframeNode);

                                                        // Locate follow layout container
                                                        const e_container = iframeNode.querySelector('div.eds-carousel-swiper-viewport');
                                                        //console.log("Looking for follow layout container...");

                                                        if (e_container) {
                                                            // Insert the button container at the top of the found container
                                                            e_container.insertBefore(buttonContainer, e_container.firstChild);
                                                            //console.log("Button container added to iframe container:", e_container);
                                                            iframeObserver.disconnect(); // Stop observing after finding
                                                        } else {
                                                            console.log("Follow layout container not found in modal.");
                                                        }
                                                    } else {
                                                        console.log("The added node is not the target section.");
                                                    }
                                                } else {
                                                    console.log("Added node is not an element.");
                                                }
                                            });
                                        });
                                    });

                                    // Begin observing changes in the iframe's body
                                    iframeObserver.observe(iframeDocument.body, {
                                        childList: true,
                                        subtree: true // Observe all subtree changes
                                    });

                                    console.log("Started observing mutations for the new iframe.");
                                } catch (error) {
                                    console.error("Error accessing iframe content:", error);
                                }
                            });
                        } else {
                            console.log("Added node is not an iframe.");
                        }
                    });
                });
            });

            // Start observing changes in the entire document
            observer.observe(document.body, {
                childList: true,
                subtree: true // Observe changes in all subtree nodes
            });

            console.log("Started observing DOM mutations for iframes.");
            break;

        case 'meetup.com':
            // Attempt to locate the target element directly
            const element = document.querySelector('div.text-white[data-testid="event-going-banner"]');
            if (element) {
                // Locate the container to insert the button
                const node = document.querySelector('div#event-info');
                container = node.parentNode;

                if (container && !container.querySelector('.button_container') && element) {
                    // Insert the button container at the top of the found container
                    container.insertBefore(buttonContainer, container.firstChild);
                    console.log("Button container added to container:", container);
                }
            } else {
                // If target element is not found, use a MutationObserver to detect DOM changes
                const observer1 = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        //console.log("Mutation detected:", mutation);
                        mutation.addedNodes.forEach((addedNode) => {
                            console.log("Added node:", addedNode);

                            // Find target nodes to locate the container
                            const nodes = document.querySelectorAll('div.flex.items-center.justify-between');
                            if (nodes.length > 2) {
                                const container = nodes[2].parentNode.parentNode;
                                const element = document.querySelector('div.text-white[data-testid="event-going-banner"]');

                                // Check conditions and insert the button if met
                                if (container && !container.querySelector('.button_container') && element) {
                                    container.appendChild(buttonContainer);
                                    //console.log("Button container added to container:", container);
                                    observer1.disconnect(); // Stop observing after finding
                                } else {
                                    console.log("Button container already exists or required element not found.");
                                }
                            } else {
                                console.log("Not enough nodes found to identify the container.");
                            }
                        });
                    });
                });

                // Start observing the entire document
                observer1.observe(document.body, {
                    childList: true,
                    subtree: true // Observe all subtree nodes
                });

                console.log("Started observing DOM mutations for meetup.com.");
            }
            break;

        case 'allevents.in':
            // Locate container for button insertion
            container = document.querySelector('div.flex-column');
            if (container && !container.querySelector('.button_container')) {
                // Insert the button container at the top of the found container
                container.insertBefore(buttonContainer, container.firstChild);
                //console.log("Button container added to container:", container);
            }
            break;

        default:
            console.warn('Unknown site:', site);
            return; // Exit if the site is unknown
    }
    console.log("container" + container);
}


let eventInfo = {
    title: "Default Event Title",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    location: {
        name: "Online",
        city: "Unknown City",
        province: "Unknown Province",
        country: "Unknown Country",
        streetAddress: "Unknown Street Address"
    },
    description: "Event description goes here."
};

// Function to assign event data to eventInfo
function assignInfo(eventData) {
    eventInfo.title = eventData.name || eventInfo.title;
    eventInfo.startDate = eventData.startDate || eventInfo.startDate;
    eventInfo.endDate = eventData.endDate || eventInfo.endDate;
    eventInfo.location.name = eventData.location?.name || eventInfo.location.name;
    eventInfo.location.city = eventData.location?.address?.addressLocality || eventInfo.location.city;
    eventInfo.location.province = eventData.location?.address?.addressRegion || eventInfo.location.province;
    eventInfo.location.country = eventData.location?.address?.addressCountry || eventInfo.location.country;
    eventInfo.location.streetAddress = eventData.location?.address?.streetAddress || eventInfo.location.streetAddress;
    eventInfo.description = eventData.description || eventInfo.description;
}

// Function to generate event data based on the website
async function generateEventData(site) {
    const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
    const scriptTag_Mode = Array.from(scriptTags).find(st => {
        const data = JSON.parse(st.innerText);
        return data.eventAttendanceMode; // Find script tag with event attendance mode
    });

    let eventData;

    switch (site) {
        case 'lu.ma':
            eventData = JSON.parse(scriptTags[0].innerText);
            assignInfo(eventData);
            break;
        case 'meetup.com':
            eventData = JSON.parse(scriptTags[1].innerText);
            assignInfo(eventData);
            break;
        case 'eventbrite.ca':
            eventData = JSON.parse(scriptTag_Mode.innerText);
            assignInfo(eventData);
            break;
        case 'allevents.in':
            eventData = JSON.parse(scriptTags[0].innerText);
            assignInfo(eventData);
            break;
        default:
            // Use the default eventInfo object
            break;
    }

    // Get the startDate from the event object and format it to YYYYMMDD
    const startDate = new Date(eventInfo.startDate);
    const dateDigits = startDate.toISOString().split('T')[0].replace(/-/g, '');

    // Generate an abbreviation from the event name and location
    const eventTitle_Local = Extract(eventInfo.title) + Extract(eventInfo.location.name);
    console.log("Event Title and Local:", eventTitle_Local);

    // Combine the abbreviation with the date digits to create a unique event_id
    const eventId = `${eventTitle_Local}${dateDigits}`;
    console.log("Generated Event ID:", eventId);

    return { eventInfo, eventId };
}
// Click event listener for the button
button.addEventListener('click', async () => {
    const { eventInfo, eventId } = await generateEventData(site);
    const apiUrl = `https://beta.popin.site/?event_id=${eventId}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const data = await response.json();
        console.log("Response from server:", data);
        
    } catch (error) {
        console.error("Error sending eventId to the backend:", error);
    } 
});

// Create a MutationObserver to monitor DOM changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
            // If the button container is removed, re-insert it
            if (node === buttonContainer) {
                console.log("Button container was removed, re-inserting...");
                embedButton(site);
            }
        });
    });
});
// Start observing for DOM changes
observer.observe(document.body, {
    childList: true,
    subtree: true // Monitor changes in the entire document
});

embedButton(site);
console.log("Button created");


